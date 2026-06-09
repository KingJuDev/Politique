#!/bin/bash

# 🚀 Script de lancement rapide - Politique

echo "🗳️  Application Politique - Quiz Electoral"
echo "=========================================="
echo ""

# Vérifier les versions
echo "📋 Vérification des prérequis..."
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "📥 Téléchargez Node.js: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Naviguer dans le répertoire
cd /Users/floriojulien/Code/Angular/Politique

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    echo "   (Cela peut prendre 2-5 minutes)"
    echo ""
    npm install
    echo ""
fi

# Lancer l'application
echo "🚀 Lancement du serveur de développement..."
echo ""
echo "📱 L'application se lancera automatiquement sur: http://localhost:4200/"
echo ""
echo "💡 Conseils:"
echo "   - Appuyez sur Ctrl+C pour arrêter le serveur"
echo "   - Les modifications du code se rechargent automatiquement"
echo "   - Ouvrez les DevTools: F12"
echo ""

npm start
