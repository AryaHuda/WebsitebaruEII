import { FileDrive } from "@/types/api/drive/file";
import gdrive from "@/lib/gdrive2";

const fileTypes: Record<string, string> = {
  "application/vnd.google-apps.folder": "folder",
  "image/jpeg": "image",
  "image/gif": "image",
  "image/png": "image",
};

async function list(folderId?: string): Promise<FileDrive[]> {
  try {
    const driveFiles = await gdrive.listFiles(
      folderId ? folderId : (process.env.SHARED_FOLDER_ID_DRIVE as string)
    );
    const listFiles: Promise<FileDrive[]> = Promise.all(
      driveFiles.map(async (file: any) => {
        const newfile: FileDrive = {
          id: file.id,
          fileType: file.mimeType,
          name: file.name,
        };

        // set the filetype
        newfile.fileType = fileTypes[file.mimeType];
        if (!newfile.fileType) {
          newfile.fileType = "file";
        }

        // set the media (deprecated)
        // if (newfile.fileType === "image") {
        //   newfile.media = (await gdrive.getMedia(newfile.id)) as string;
        // }

        // set the restrict

        return newfile;
      })
    );
    return listFiles;
  } catch (error: any) {
    throw new Error(error);
  }
}

type ParentsFolder = {
  id: string;
  name: string;
  currentName?: string;
};

async function parentsFolder(folderId: string): Promise<ParentsFolder[]> {
  try {
    const parent: any = await gdrive.getAllParentsFolder(folderId);
    const newParent = {
      id: folderId,
      name: parent.currentName,
    };
    if (parent.id && parent.id !== process.env.SHARED_FOLDER_ID_DRIVE) {
      const grandparents = await parentsFolder(parent.id);
      const newGrandparents = [
        {
          id: parent.id as string,
          name: grandparents[0].name as string,
        },
      ];
      return [newParent, ...grandparents];
    }
    return [newParent];
  } catch (error: any) {
    throw new Error(error);
  }
}

type FileUpload = {
  name: string;
  mimeType: string;
  content: Buffer;
};

async function addFile(file: FileUpload, folderId?: string) {
  const { name, mimeType, content } = file;

  try {
    const newFile = await gdrive.uploadFile(name, mimeType, content, [
      folderId ? folderId : (process.env.SHARED_FOLDER_ID_DRIVE as string),
    ]);
    return newFile;
  } catch (error: any) {
    throw new Error(error);
  }
}

type NewFolder = {
  id: string;
  name: string;
};

async function addFolder(
  folderName: string,
  folderId?: string
): Promise<NewFolder> {
  try {
    const newFolderId = await gdrive.createFolder(
      folderName,
      folderId ? [folderId] : [process.env.SHARED_FOLDER_ID_DRIVE as string]
    );
    return {
      id: newFolderId,
      name: folderName,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

async function checkId(id: string) {
  try {
    const file = await gdrive.getFile(id);
    return file;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function deleteFile(id: string) {
  // check the file first
  const file = await checkId(id);

  if (!file) {
    throw new Error("file not found");
  }

  const parents = await parentsFolder(id);
  const parentsId = parents.map((parent: any) => parent.id);
  parentsId.push(id);
  try {
    const file = await gdrive.deleteFileOrFolder(id, parentsId);

    return file;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function renameFile(id: string, newName: string) {
  // check the file first
  const file = await checkId(id);

  if (!file) {
    throw new Error("file not found");
  }

  const parents = await parentsFolder(id);
  const parentsId = parents.map((parent: any) => parent.id);
  parentsId.push(id);

  try {
    const file = await gdrive.renameFileOrFolder(id, newName, parentsId);

    return file;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function folderName(id: string) {
  try {
    return await gdrive.getFolderName(id);
  } catch (error: any) {
    throw new Error(error);
  }
}

const driveServices = {
  list,
  addFile,
  addFolder,
  folderName,
  parentsFolder,
  renameFile,
  deleteFile,
};

export default driveServices;
