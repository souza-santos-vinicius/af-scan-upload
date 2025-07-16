import { useState } from 'react';
import { Save, X, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImagePreviewProps {
  file: File;
  onSave: (file: File) => void;
  onDiscard: () => void;
}

export const ImagePreview = ({ file, onSave, onDiscard }: ImagePreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSave(file);
      setIsSaved(true);
      
      toast({
        title: "Documento salvo com sucesso!",
        description: "O arquivo foi salvo no SharePoint.",
        variant: "default"
      });
      
      // Voltar para o início após 2 segundos
      setTimeout(() => {
        onDiscard();
      }, 2000);
      
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: "Erro ao salvar documento",
        description: "Ocorreu um erro ao salvar o arquivo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fileUrl = URL.createObjectURL(file);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-elegant animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Pré-visualização</h2>
          <Button variant="ghost" size="sm" onClick={onDiscard} disabled={isLoading}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img 
              src={fileUrl} 
              alt="Documento capturado" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Nome do arquivo:</span>
              <span className="font-medium">{file.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
              <span>Tamanho:</span>
              <span className="font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>

          {isSaved ? (
            <div className="text-center py-4">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-2" />
              <p className="text-success font-medium text-lg">Documento salvo com sucesso!</p>
              <p className="text-muted-foreground text-sm">Redirecionando...</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Documento
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onDiscard}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Descartar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};