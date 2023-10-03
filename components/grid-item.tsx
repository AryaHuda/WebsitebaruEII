import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type Item = {
  id: string;
  name: string;
  cover?: string;
  type: string;
};

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: Item;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function GridItem({
  item,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: GridItemProps) {

  const image = (item: Item) => {
    if (item.type.includes("image")) return item.cover;
    if (item.type.includes("folder")) return "./images/folder.svg";
    return "./images/file.svg";
  };

  const handleDetail = () => {
    console.log('detail');
    console.log(item);
  }
  
  const handleOpen = () => {
    console.log('open');
  }
  
  const handleDelete = async () => {
    console.log('delete');
    try {
      const response = await fetch(`http://localhost:3000/api/drive/file/${item.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data);
      if(data.status === 200) {
        console.log('delete berhasil');
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <Image
              src={image(item) as string}
              alt={item.name}
              width={width}
              height={height}
              className={cn(
                "h-full w-full object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem  onClick={() => handleOpen()}>Open</ContextMenuItem>
          <ContextMenuItem onClick={() => handleDetail()}>Detail</ContextMenuItem>
          <ContextMenuItem className="text-red-600" onClick={() => handleDelete()}>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm flex align-center items-start justify-start h-12">
        <h3 className="font-medium leading-none break-all px-2 py-1">
          {item.name}
        </h3>
      </div>
    </div>
  );
}
