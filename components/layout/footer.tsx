import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="mx-auto flex justify-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-U20NNFuXIuRgVFL8KZ8DxdJ3sExZBr.png"
          alt="BoaSafra AG"
          width={200}
          height={50}
          className="h-10 w-auto"
        />
      </div>
    </footer>
  )
}
