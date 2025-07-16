import { useState, useEffect } from 'react';
import { X, Settings, Save, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  savePath: string;
  onSavePathChange: (path: string) => void;
}

export const AdminPanel = ({ isOpen, onClose, savePath, onSavePathChange }: AdminPanelProps) => {
  const [localSavePath, setLocalSavePath] = useState(savePath);
  const [siteUrl, setSiteUrl] = useState('https://empresa.sharepoint.com/sites/Financeiro');
  const [libraryName, setLibraryName] = useState('Documentos');
  const [folderPath, setFolderPath] = useState('Aplicativos/AFScan');
  const { toast } = useToast();

  // Carregar configurações salvas quando o painel abrir
  useEffect(() => {
    if (isOpen) {
      const savedConfig = localStorage.getItem('afScanConfig');
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          if (config.siteUrl) setSiteUrl(config.siteUrl);
          if (config.libraryName) setLibraryName(config.libraryName);
          if (config.folderPath) setFolderPath(config.folderPath);
          if (config.fullPath) setLocalSavePath(config.fullPath);
        } catch (error) {
          console.error('Erro ao carregar configurações:', error);
        }
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    const fullPath = `${siteUrl}/${libraryName}/${folderPath}`;
    onSavePathChange(fullPath);
    setLocalSavePath(fullPath);
    
    // Salvar no localStorage
    localStorage.setItem('afScanConfig', JSON.stringify({
      siteUrl,
      libraryName,
      folderPath,
      fullPath
    }));
    
    toast({
      title: "Configurações salvas!",
      description: "O caminho de salvamento foi atualizado com sucesso.",
      variant: "default"
    });
    
    onClose();
  };

  const handleReset = () => {
    const defaultSiteUrl = 'https://empresa.sharepoint.com/sites/Financeiro';
    const defaultLibraryName = 'Documentos';
    const defaultFolderPath = 'Aplicativos/AFScan';
    
    setSiteUrl(defaultSiteUrl);
    setLibraryName(defaultLibraryName);
    setFolderPath(defaultFolderPath);
    setLocalSavePath(`${defaultSiteUrl}/${defaultLibraryName}/${defaultFolderPath}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Painel de Administrador
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Configuração do Site SharePoint */}
          <div className="space-y-2">
            <Label htmlFor="siteUrl">URL do Site SharePoint</Label>
            <Input
              id="siteUrl"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://empresa.sharepoint.com/sites/Financeiro"
            />
          </div>

          {/* Nome da Biblioteca */}
          <div className="space-y-2">
            <Label htmlFor="libraryName">Nome da Biblioteca de Documentos</Label>
            <Input
              id="libraryName"
              value={libraryName}
              onChange={(e) => setLibraryName(e.target.value)}
              placeholder="Documentos"
            />
          </div>

          {/* Pasta de Destino */}
          <div className="space-y-2">
            <Label htmlFor="folderPath">Pasta de Destino</Label>
            <Input
              id="folderPath"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="Aplicativos/AFScan"
            />
          </div>

          {/* Caminho Completo Preview */}
          <div className="space-y-2">
            <Label>Caminho Completo de Salvamento</Label>
            <div className="bg-muted p-3 rounded-md">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Folder className="h-4 w-4" />
                <span className="font-mono">{siteUrl}/{libraryName}/{folderPath}</span>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-primary/5 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Informações Importantes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• O aplicativo criará automaticamente a pasta se ela não existir</li>
              <li>• Certifique-se de que o usuário tem permissões de escrita na biblioteca</li>
              <li>• Os arquivos serão nomeados como: Scan_[usuario]_[data-hora].jpg</li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Restaurar Padrão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};