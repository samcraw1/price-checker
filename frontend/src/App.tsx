import { Routes, Route } from 'react-router-dom'
import { AppShell } from './shell/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Applications } from './pages/Applications'
import { Projects } from './pages/Projects'
import { Videos } from './pages/Videos'
import { YoutubeConvert } from './pages/YoutubeCovert'
import { Notes } from './pages/Notes'
import { PriceTracker } from './pages/PriceTracker'
import { Email } from './pages/Email'
import './App.css'
import './shell/shell.css'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/price-tracker" element={<PriceTracker />} />
        <Route path="/youtube-convert" element={<YoutubeConvert />} />
        <Route path="/email" element={<Email />} />
      </Route>
    </Routes>
  )
}

export default App
