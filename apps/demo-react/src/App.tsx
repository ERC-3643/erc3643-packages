import React from 'react'
import { Layout } from 'antd'
import { Footer } from 'antd/es/layout/layout'
import Header from './Header/Header'
import Content from './Content/Content'

function App() {
  return (
    <Layout>
      <Header />
      <Content />
      <Footer>Footer</Footer>
    </Layout>
  )
}

export default App
