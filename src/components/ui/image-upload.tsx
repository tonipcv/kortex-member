"use client"

import { CameraIcon, X } from "lucide-react"
import Image from "next/image"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Aqui você pode implementar o upload para um serviço de armazenamento
        // Por enquanto, vamos usar o base64 da imagem
        onChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [onChange])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    disabled
  })

  return (
    <div className={className}>
      <div
        {...getRootProps({
          className: "relative cursor-pointer hover:opacity-70 transition border-2 border-dashed border-white/20 rounded-full overflow-hidden h-40 w-40 mx-auto",
        })}
      >
        <input {...getInputProps()} />
        {value ? (
          <>
            <Image
              fill
              style={{ objectFit: "cover" }}
              src={value}
              alt="Avatar"
            />
            {!disabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <CameraIcon className="h-6 w-6 text-white" />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <CameraIcon className="h-6 w-6 text-white/70" />
            <p className="text-xs text-white/70 mt-2">Upload</p>
          </div>
        )}
      </div>
      {value && !disabled && (
        <Button
          onClick={() => onChange("")}
          variant="outline"
          className="mt-2"
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Remover
        </Button>
      )}
    </div>
  )
} 