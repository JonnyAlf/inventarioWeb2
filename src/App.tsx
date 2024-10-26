import { useState } from 'react';
import './App.css';
import FornecedorComponent from './components/fornecedor/fornecedorComponent';
import ClientManagement from './components/cliente/clienteComponent';
import { Button } from './components/ui/button';

function App() {
  const [activeComponent, setActiveComponent] = useState<'cliente' | 'fornecedor' | null>(null);

  return (
    <div className='App'>
      <div>
        <Button onClick={() => setActiveComponent('cliente')}>Gerenciar Clientes</Button>
        <Button onClick={() => setActiveComponent('fornecedor')}>Gerenciar Fornecedores</Button>
      </div>

      <div>
        {activeComponent === 'cliente' && <ClientManagement />}
        {activeComponent === 'fornecedor' && <FornecedorComponent />}
      </div>
    </div>
  );
}

export default App;
