"use client";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { madeForYouAlbums } from "@/data/albums";
import DashboardLayout from "@/layouts/DashboardLayouts";
import Lists from "@/components/lists";
import { InputFile } from "@/components/input-file";
import { useEffect, useState } from "react";
import AddFolderDialog from "@/components/add-folder";
import Loading from "@/components/loading";
import useListStore from "@/lib/zustand/store";
import Image from "next/image";

export default function HomePage() {
  const {
    files,
    loadingFile,
    setLoadingFile,
    loadingFolder,
    loadingList,
    refreshList,
  } = useListStore((store) => ({
    files: store.files,
    loadingFile: store.loadingFile,
    setLoadingFile: store.setLoadingFile,
    loadingFolder: store.loadingFolder,
    loadingList: store.loadingList,
    refreshList: store.refreshList,
  }));

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <>
      <DashboardLayout>
        <div className="col-span-3 lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8">
            {/* Image */}
            {/* <Image src={'https://drive.google.com/uc?export=view&id=14knCAAMPY1Jej6pnXBSnflGgQf2DRACY'} width={200} height={200} alt="tes" /> */}
            {/* Thumbnail of image */}
            {/* <Image src={'https://drive.google.com/thumbnail?id=14knCAAMPY1Jej6pnXBSnflGgQf2DRACY'} width={200} height={200} alt="tes" /> */}
            {/* Thumbnail of video */}
            {/* <Image src={'https://drive.google.com/thumbnail?id=1t2QYviFna-sPGXa1S_BPge5VuYacvcNX'} width={200} height={200} alt="tes" /> */}
            {/* Video but got hydration error */}
            {/* <video src="https://drive.google.com/uc?export=view&id=1t2QYviFna-sPGXa1S_BPge5VuYacvcNX" controls></video> */}
            <Tabs defaultValue="upload" className="h-full space-y-6">
              <div className=" flex items-center">
                <TabsList>
                  <TabsTrigger value="upload" className="relative">
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
                <div className="ml-auto mr-4">
                  <div className="flex gap-2">
                    <Loading size={30} loading={loadingFolder} />
                    <AddFolderDialog />
                  </div>
                </div>
              </div>
              <TabsContent
                value="upload"
                className="border-none p-0 outline-none"
              >
                <div className="mt-6 space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Lists
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    list that can be scrolled horizontally
                  </p>
                </div>
                <div className="flex align-middle gap-2">
                  <InputFile
                    onUpload={refreshList}
                    setLoading={setLoadingFile}
                  />
                  <Loading loading={loadingFile} size={30} />
                </div>
                <Separator className="my-4" />
                <Lists
                  listItems={files}
                  canScroll={true}
                  type="grid"
                  loading={loadingList}
                />
              </TabsContent>
              <TabsContent
                value="list"
                className="h-full flex-col border-none p-0 data-[state=active]:flex"
              >
                <div className="mt-6 space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Lists
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    list that can be scrolled horizontally
                  </p>
                </div>
                <Separator className="my-4" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
