import FileUploader from "@/src/app/project/components/file-uploader/FileUploader";

const colorSchemes = [
  {
    name: "Sunset Vibes",
    bg: "bg-gradient-to-br from-orange-100 via-pink-100 to-red-100",
    description: "Warm analogous colors",
  },
  {
    name: "Ocean Breeze",
    bg: "bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100",
    description: "Cool analogous colors",
  },
  {
    name: "Electric Pop",
    bg: "bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200",
    description: "Triadic harmony",
  },
  {
    name: "Mint Fresh",
    bg: "bg-gradient-to-br from-green-100 via-emerald-100 to-cyan-100",
    description: "Cool analogous",
  },
  {
    name: "Retro Gaming",
    bg: "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200",
    description: "Purple spectrum",
  },
];

export default function Page() {
  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          COLOR HARMONY EXAMPLES
        </h1>
        <p className="text-lg font-bold text-gray-700">
          Different background options for your neo-brutalist uploader
        </p>
      </div>

      {colorSchemes.map((scheme, index) => (
        <div key={index} className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-900">{scheme.name}</h2>
            <p className="text-sm font-bold text-gray-600">
              {scheme.description}
            </p>
          </div>

          <div className={`min-h-screen p-8 ${scheme.bg}`}>
            <FileUploader />
          </div>
        </div>
      ))}

      {/* Pattern Background Example */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">
            Geometric Pattern
          </h2>
          <p className="text-sm font-bold text-gray-600">
            Textured background with dots
          </p>
        </div>

        <div className="min-h-screen p-8 bg-yellow-50 bg-[radial-gradient(circle_at_2px_2px,_rgba(0,0,0,0.1)_2px,_transparent_0)] bg-[length:30px_30px]">
          <FileUploader />
        </div>
      </div>

      {/* Solid Color with Texture */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">Textured Solid</h2>
          <p className="text-sm font-bold text-gray-600">
            Single color with subtle texture
          </p>
        </div>

        <div className="min-h-screen p-8 bg-blue-50 bg-[linear-gradient(45deg,_transparent_25%,_rgba(0,0,0,0.05)_25%,_rgba(0,0,0,0.05)_50%,_transparent_50%,_transparent_75%,_rgba(0,0,0,0.05)_75%)] bg-[length:20px_20px]">
          <FileUploader />
        </div>
      </div>
    </div>
  );
}
