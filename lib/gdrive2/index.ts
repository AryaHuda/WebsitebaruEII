import { auth, drive } from "@googleapis/drive";
import { Buffer } from "buffer";
import myCache from "../node-cache";

let dClient: ReturnType<typeof drive> | undefined;

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT as string);

export async function getDriveClient() {
  if (!dClient) {
    dClient = drive({
      version: "v3",
      auth: new auth.GoogleAuth({
        credentials,
        scopes: "https://www.googleapis.com/auth/drive",
      }),
    });
  }

  return dClient;
}

type FileGD = {
  id: string;
  mimeType: string;
  name: string;
};

async function listFiles(folderId: string): Promise<FileGD[]> {
  const cacheKey = `listFiles-${folderId}`
  if (myCache.has(cacheKey)) {
    return myCache.get(cacheKey) as FileGD[];
  }
  try {

    const driveClient = await getDriveClient();

    const list = await driveClient.files.list({
      q: folderId
        ? `'${folderId}' in parents AND trashed = false`
        : "trashed = false",
      fields: "files(id, mimeType, name, parents)",
    });

    if (
      !list.data.files ||
      list.data.files.length === 0 ||
      !list.data.files === undefined
    ) {
      return [];
    }
    myCache.set(cacheKey, list.data.files as FileGD[]);
    return list.data.files as FileGD[];
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

async function getFolderName(id: string): Promise<string> {
  const cacheKey = `getFolderName-${id}`
  if (myCache.has(cacheKey)) {
    return myCache.get(cacheKey) as string;
  }
  const driveClient = await getDriveClient();

  const file = await driveClient.files.get({
    fileId: id,
    fields: "name",
  });
  myCache.set(cacheKey, file.data.name as string);
  return file.data.name as string;
}

async function getMedia(id: string): Promise<string> {
  const cacheKey = `getMedia-${id}`
  if (myCache.has(cacheKey)) {
    return myCache.get(cacheKey) as string;
  }
  const driveClient = await getDriveClient();

  const file = await driveClient.files.get(
    {
      fileId: id,
      alt: "media",
    },
    { responseType: "stream" }
  );

  return new Promise((resolve, reject) => {
    let buf: any = [];
    file.data
      .on("data", (d) => {
        buf.push(d);
      })
      .on("end", () => {
        let img = Buffer.concat(buf).toString("base64");
        myCache.set(cacheKey, img);
        resolve(img);
      });
  });
}

async function createFolder(name: string, parent: string[]) {
  const cacheKey = `listFiles-${parent[0]}`
  myCache.del(cacheKey);
  const driveClient = await getDriveClient();

  const folderMetadata = {
    name,
    mimeType: "application/vnd.google-apps.folder",
    parents: parent,
  };

  const folder = await driveClient.files.create({
    requestBody: folderMetadata,
    fields: "id",
  });

  return folder.data.id as string;
}

export async function getAllParentsFolder(folderId: string): Promise<any> {
  const driveClient = await getDriveClient();

  const file = await driveClient.files.get({
    fileId: folderId,
    fields: "id, name, mimeType, parents",
  });

  if (!file.data.parents || file.data.parents.length === 0) {
    return [];
  }

  const parents = {
    currentId: file.data.id,
    currentName: file.data.name,
    id: file.data.parents[0]
  };
  return parents;
}

const gdrive = {
  listFiles,
  getMedia,
  getFolderName,
  getAllParentsFolder,
  createFolder,
};

export default gdrive;
