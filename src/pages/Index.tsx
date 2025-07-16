import { useState, useEffect } from 'react';
import { Scan, Users, CheckCircle, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CameraCapture } from '@/components/CameraCapture';
import { ImagePreview } from '@/components/ImagePreview';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AdminPanel } from '@/components/AdminPanel';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-image.jpg';

type AppState = 'login' | 'authenticated' | 'capturing' | 'preview' | 'loading';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [savePath, setSavePath] = useState('https://empresa.sharepoint.com/sites/Financeiro/Documentos/Aplicativos/AFScan');
  const { toast } = useToast();

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('afScanConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.fullPath) {
          setSavePath(config.fullPath);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  const handleLogin = () => {
    setAppState('loading');
    
    // Simular processo de autenticação
    setTimeout(() => {
      setUser('João Silva');
      setAppState('authenticated');
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao AF Scan.",
        variant: "default"
      });
    }, 2000);
  };

  const handleStartCapture = () => {
    setAppState('capturing');
  };

  const handleImageCaptured = (file: File) => {
    setCapturedFile(file);
    setAppState('preview');
  };

  const handleSaveDocument = (file: File) => {
    console.log('Saving document:', file.name);
    // Aqui seria implementada a lógica de envio para SharePoint
    setTimeout(() => {
      setAppState('authenticated');
      setCapturedFile(null);
    }, 2000);
  };

  const handleDiscard = () => {
    setCapturedFile(null);
    setAppState('authenticated');
  };

  const handleCancelCapture = () => {
    setAppState('authenticated');
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
            <LoadingSpinner size="lg" text="Autenticando..." />
          </div>
        );

      case 'capturing':
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
            <CameraCapture 
              onImageCaptured={handleImageCaptured}
              onClose={handleCancelCapture}
            />
          </div>
        );

      case 'preview':
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
            {capturedFile && (
              <ImagePreview 
                file={capturedFile}
                onSave={handleSaveDocument}
                onDiscard={handleDiscard}
              />
            )}
          </div>
        );

      case 'authenticated':
        return (
          <div className="min-h-screen bg-gradient-subtle">
            {/* Header */}
            <header className="bg-card shadow-elegant border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-primary p-2 rounded-lg">
                      <Scan className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">AF Scan</h1>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Olá, {user}</span>
                    <Button variant="outline" size="sm" onClick={() => setIsAdminOpen(true)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAppState('login')}>
                      Sair
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-foreground mb-4">
                    Digitalize Documentos Facilmente
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Capture e salve documentos diretamente no SharePoint da sua organização
                  </p>
                  
                  <Button 
                    onClick={handleStartCapture}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 shadow-glow"
                  >
                    <Scan className="h-5 w-5 mr-2" />
                    Capturar Novo Documento
                  </Button>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="text-center shadow-elegant">
                    <CardContent className="p-6">
                      <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                        <Scan className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Captura Rápida</h3>
                      <p className="text-muted-foreground">
                        Use a câmera do dispositivo para capturar documentos em segundos
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center shadow-elegant">
                    <CardContent className="p-6">
                      <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Integração Microsoft</h3>
                      <p className="text-muted-foreground">
                        Salve diretamente no SharePoint com autenticação corporativa
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center shadow-elegant">
                    <CardContent className="p-6">
                      <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Seguro</h3>
                      <p className="text-muted-foreground">
                        Seus documentos são enviados diretamente para o servidor seguro
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Info Section */}
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">Como funciona</h3>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                            Faça login com sua conta corporativa Microsoft
                          </li>
                          <li className="flex items-start">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                            Clique em "Capturar Novo Documento"
                          </li>
                          <li className="flex items-start">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                            Fotografe o documento ou selecione um arquivo
                          </li>
                          <li className="flex items-start">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
                            Revise e salve no SharePoint
                          </li>
                        </ul>
                      </div>
                      <div className="text-center">
                        <img 
                          src={heroImage} 
                          alt="Digitalização de documentos" 
                          className="rounded-lg shadow-elegant w-full max-w-md mx-auto"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        );

      default: // login
        return (
          <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-md mx-auto text-center">
                <div className="bg-card rounded-2xl shadow-elegant p-8 animate-fade-in">
                  <div className="bg-gradient-primary p-4 rounded-full w-fit mx-auto mb-6">
                    <Scan className="h-12 w-12 text-white" />
                  </div>
                  
                  <h1 className="text-3xl font-bold text-foreground mb-4">AF Scan</h1>
                  <p className="text-muted-foreground mb-8">
                    Faça login com sua conta corporativa para digitalizar documentos.
                  </p>
                  
                  <Button 
                    onClick={handleLogin}
                    size="lg"
                    className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Entrar com a Conta Corporativa Microsoft
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Seus documentos serão salvos em:
                    <br />
                    <span className="font-medium font-mono text-xs">{savePath}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderContent()}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        savePath={savePath}
        onSavePathChange={setSavePath}
      />
    </>
  );
};

export default Index;