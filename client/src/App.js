import './App.css'
import Title from './components/layout/Title'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import 'antd/dist/reset.css'
import AddPerson from './components/forms/AddPerson'
import AddCar from './components/forms/AddCar'
import People from './components/lists/People'


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <Title />
        <AddPerson />
        <AddCar />
        <People />
      </div>
    </ApolloProvider>
  )
}

export default App
