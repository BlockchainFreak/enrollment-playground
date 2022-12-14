import Head from 'next/head'
import '../styles/globals.css'
import '@remotelock/react-week-scheduler/index.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Analytics } from '@vercel/analytics/react';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Enrollment Playground</title>
        <meta property='og:image' content='https://i.ibb.co/BtfJZL8/preview.jpg'/>
        <meta property='og:description' content="Find clash-free schedules"/>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Component {...pageProps} />
      </ThemeProvider>
      <Analytics/>
    </>
  )
}

export default MyApp
