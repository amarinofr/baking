import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Ingredients from './components/Ingredients'

const client = new QueryClient()
const BASE_URL = 'http://localhost:4567/api/'

function App() {
    return (
        <QueryClientProvider client={client}>
            <section className="w-fit p-10 flex gap-10">
                <Ingredients baseUrl={BASE_URL} />
            </section>
        </QueryClientProvider>
    )
}
export default App
