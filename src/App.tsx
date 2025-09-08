import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Globe, Image, Sparkles, Copy, CheckCircle, X } from 'lucide-react'

function App() {
  const [url, setUrl] = useState('')
  const [screenshots, setScreenshots] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (screenshots.length === 0) {
      alert('Veuillez ajouter au moins une capture d\'écran')
      return
    }

    setLoading(true)
    
    const formData = new FormData()
    formData.append('url', url)
    screenshots.forEach((screenshot, index) => {
      formData.append(`screenshot_${index}`, screenshot)
    })

    try {
      const response = await fetch('https://n8n.srv992506.hstgr.cloud/webhook/3f0c7464-4b5b-44c3-b094-78d1527b6a45', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Réponse JSON du webhook:', data)
        setResults(data.output)
      } else {
        throw new Error('Erreur lors de l\'envoi')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de l\'analyse')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const totalFiles = screenshots.length + newFiles.length
    
    if (totalFiles > 4) {
      alert('Maximum 4 captures d\'écran autorisées')
      return
    }

    setScreenshots(prev => [...prev, ...newFiles])
  }

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-[600px]">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-2xl shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Analyse & Amélioration de Site
          </h1>
          <p className="text-lg text-gray-600">
            Obtenez une analyse détaillée de votre site web et des suggestions d'amélioration générées par IA
          </p>
        </div>

        {/* Formulaire */}
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Analysez votre site
            </CardTitle>
            <CardDescription className="text-gray-500">
              Entrez l'URL de votre site et téléchargez jusqu'à 4 captures d'écran (obligatoire)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-2 text-gray-700 font-medium justify-center">
                  <Globe className="h-4 w-4 text-blue-600" />
                  URL du site
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://votresite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshots" className="flex items-center gap-2 text-gray-700 font-medium justify-center">
                  <Image className="h-4 w-4 text-green-600" />
                  Captures d'écran (obligatoire - max 4)
                </Label>
                <Input
                  id="screenshots"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={screenshots.length >= 4}
                  className="w-full border-gray-300 file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-blue-100 transition-colors"
                />
                <p className="text-sm text-gray-500 text-center">
                  {screenshots.length}/4 images sélectionnées
                </p>

                {/* Aperçu des images */}
                {screenshots.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {screenshots.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Capture ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyser le site
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Résultats */}
        {results && (
          <Card className="w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl p-5">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold justify-center">
                <Sparkles className="h-5 w-5" />
                Résultats de l'analyse
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words text-left">
                  {results}
                </pre>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(results)}
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copier les résultats
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        {!results && !loading && (
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Prêt à optimiser votre présence en ligne ? Commencez par analyser votre site.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
