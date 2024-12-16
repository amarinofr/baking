import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Ingredient from './components/Ingredient'

const client = new QueryClient()

const ingredient = {
    _id: '1',
    name: 'Ingredient 1',
    completed: false,
}

function App() {
    return (
        <QueryClientProvider client={client}>
            <Ingredient ingredient={ingredient} />
        </QueryClientProvider>
    )
}

export default App
