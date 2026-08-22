import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import './index.css'
import App from './App.jsx'
import { auth } from './firebase'

// La session anonyme s'ouvre AVANT le premier rendu. Deux raisons :
// les règles Firebase exigent un utilisateur, et un listener refusé pour
// permission n'est pas rejoué tout seul une fois la connexion établie —
// on aurait une app vide jusqu'au rechargement.
// L'utilisateur ne voit rien : aucun écran de connexion, rien à saisir.

let started = false

function start() {
  if (started) return
  started = true
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

onAuthStateChanged(auth, user => {
  if (user) start()
})

signInAnonymously(auth).catch(err => {
  console.error('Connexion anonyme impossible', err)
  // On affiche quand même l'app : une page blanche serait pire qu'une app
  // qui n'arrive pas à lire ses données et le dit.
  start()
})
