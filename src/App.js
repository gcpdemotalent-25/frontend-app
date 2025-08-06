import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// URLs des APIs. En production, elles viendraient de variables d'environnement.
const API_PRODUIT_URL = 'https://produit-service-usut6o4i3q-ew.a.run.app/produits'; //'http://localhost:8080/produits';
const API_COMMANDE_URL = 'https://commande-service-usut6o4i3q-ew.a.run.app/commandes'; //'http://localhost:8080/commandes';

function App() {
  const [produits, setProduits] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState('');
  const [quantite, setQuantite] = useState(1);

  // Charger les produits et les commandes au démarrage
  useEffect(() => {
    fetchProduits();
    fetchCommandes();
  }, []);

  const fetchProduits = async () => {
    try {
      const response = await axios.get(API_PRODUIT_URL);
      setProduits(response.data);
      if (response.data.length > 0) {
        setSelectedProduit(response.data[0].id); // Sélectionner le premier produit par défaut
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    }
  };

  const fetchCommandes = async () => {
    try {
      const response = await axios.get(API_COMMANDE_URL);
      setCommandes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    }
  };

  const handleCommandeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduit || quantite <= 0) {
      alert("Veuillez sélectionner un produit et une quantité valide.");
      return;
    }

    const commandeData = {
      produitId: selectedProduit,
      quantite: quantite
    };

    try {
      await axios.post(API_COMMANDE_URL, commandeData);
      alert("Commande passée avec succès !");
      // Rafraîchir la liste des commandes
      fetchCommandes();
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      alert("Erreur: Le produit n'existe peut-être pas ou un service est indisponible.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mini E-Commerce</h1>
      </header>

      <div className="container">
        {/* Section pour créer un produit (pour le test) */}
        <div className="card">
          <h2>Ajouter un Produit (pour test)</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const nom = e.target.nom.value;
            const prix = e.target.prix.value;
            await axios.post(API_PRODUIT_URL, { nom, prix });
            fetchProduits();
            e.target.reset();
          }}>
            <input name="nom" type="text" placeholder="Nom du produit" required />
            <input name="prix" type="number" placeholder="Prix" step="0.01" required />
            <button type="submit">Ajouter Produit</button>
          </form>
        </div>

        {/* Section pour passer une commande */}
        <div className="card">
          <h2>Passer une Commande</h2>
          <form onSubmit={handleCommandeSubmit}>
            <select value={selectedProduit} onChange={(e) => setSelectedProduit(e.target.value)}>
              {produits.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nom} - {p.prix}€
                </option>
              ))}
            </select>
            <input type="number" value={quantite} onChange={(e) => setQuantite(Number(e.target.value))} min="1" />
            <button type="submit">Commander</button>
          </form>
        </div>
      </div>
      
      <div className="container">
         {/* Section pour lister les produits */}
        <div className="card list-card">
          <h2>Liste des Produits</h2>
          <ul>
            {produits.map(p => <li key={p.id}>{p.id}: {p.nom} ({p.prix}€)</li>)}
          </ul>
        </div>
        
        {/* Section pour lister les commandes */}
        <div className="card list-card">
          <h2>Liste des Commandes</h2>
          <ul>
            {commandes.map(c => <li key={c.id}>Cmd {c.id}: Produit {c.produitId}, Qté: {c.quantite}, Date: {c.dateCommande}</li>)}
          </ul>
        </div>
      </div>

    </div>
  );
}

export default App;