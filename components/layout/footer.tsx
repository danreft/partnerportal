import Image from "next/image"
import { Layout } from "antd"

export function Footer() {
  return (
    <Layout.Footer style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "16px 0" }}>
      <div className="mx-auto flex justify-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-U20NNFuXIuRgVFL8KZ8DxdJ3sExZBr.png"
          alt="BoaSafra AG"
          width={200}
          height={50}
          className="h-10 w-auto"
        />
      </div>
    </Layout.Footer>
  )
}
