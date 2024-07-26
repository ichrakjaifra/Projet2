//Importation des modules
const express = require('express');//framework pour créer des applications web
const bodyParser = require('body-parser');//middleware pour parser les corps des requêtes HTTP

const session = require('express-session'); // Importer express-session
const flash = require('connect-flash'); // Importer connect-flash


var cors=require('cors');// Middleware pour gérer les requêtes cross-origin (CORS)
var path=require('path');// Module pour manipuler les chemins de fichiers
const mysql = require('mysql2');//module pour interagir avec une base de données MySQL
const app = express(); // Initialisation de l'application Express

//Configuration de l'application
app.use(bodyParser.urlencoded({ extended: true }));// Middleware pour parser les données du formulaire
app.use(cors());// Activer CORS pour toutes les routes

app.use(express.static(path.join(__dirname,'')));// Servir les fichiers statiques depuis le répertoire courant

// Configuration du moteur de vues
app.set('views', path.join(__dirname,'views'))// Définir le dossier des vues
app.set('view engine', 'ejs');// Utiliser EJS comme moteur de templates

// Route pour la page d'accueil
app.get('/',function(request, response){
  response.render('index'); // Afficher la vue 'index.ejs'
});


// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'ichrak',
database: 'agro'
});
//Établir la connexion à la base de données et afficher un message de confirmation
db.connect((err) => {
if (err) throw err;
console.log('Connected to database');
});

// Configuration de session et de flash
app.use(session({
  secret: '123456',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Pour HTTPS, mettez secure: true
}));
app.use(flash());

// Middleware pour injecter les messages flash dans les vues
app.use((req, res, next) => {
  res.locals.message = req.flash('message');
  next();
});

// Route pour gérer la soumission du formulaire d'inscription
app.post('/register', (req, res) => {
  const { nom, email, password } = req.body;// Récupérer les données du formulaire
  console.log('Données reçues :', req.body);

  // Vérifier si l'email existe déjà en base de données
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'email :', err);
      return res.status(500).send('Erreur lors de la vérification de l\'email');
    }

    if (results.length > 0) {
      // L'email existe déjà en base de données
      // return res.send('E-mail déjà enregistré.');
      console.log('E-mail déjà enregistré .');
        req.flash('message', 'E-mail déjà enregistré !');
        res.redirect('/index');
    } else {
      var role='user';// Définir le rôle par défaut de l'utilisateur
      // L'email n'existe pas en base de données, procéder à l'inscription
      const insertSql = 'INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [nom, email, password, role], (err, result) => {
        if (err) {
          console.error('Erreur lors de l\'inscription de l\'utilisateur :', err);
          return res.status(500).send('Erreur lors de l\'inscription de l\'utilisateur');
        }
        // console.log('Utilisateur inscrit avec succès.');
        // res.send('Inscription réussie !');
        console.log('Utilisateur inscrit avec succès.');
        req.flash('message', 'Inscription réussie !');
        res.redirect('/index');
      });
    }
  });
});
// Route to display users
app.get('/utilisateurs', (req, res) => {
  db.query("SELECT * FROM users where role='user'", (err, results) => {
      if (err) throw err;
      res.render('utilisateurs', { users: results });
  });
});

// Route to delete a user
app.post('/delete-user', (req, res) => {
  const userId = req.body.id; // Récupérer l'ID de l'utilisateur du corps de la requête

  // Utiliser l'ID pour mettre à jour la colonne 'etat'
  db.query('UPDATE users SET etat = FALSE WHERE id = ? AND role = "user"', [userId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', err);
      return res.status(500).send('Erreur lors de la suppression de l\'utilisateur');
    }
    res.redirect('/utilisateurs'); // Redirection vers la page des utilisateurs
  });
});

// Route GET pour récupérer tous les emails
/*app.get('/emails', (req, res) => {
  const sql = 'SELECT email FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des emails :', err);
      return res.status(500).send('Erreur lors de la récupération des emails');
    }
    res.send(results.map(row => row.email));
  });
});

// Route POST pour le formulaire d'inscription
app.post('/register', (req, res) => {
  const { nom, email, password, role } = req.body;
  console.log('Données reçues :', req.body);

  // Vérifier si l'email existe déjà en base de données
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'email :', err);
      return res.status(500).send('Erreur lors de la vérification de l\'email');
    }

    if (results.length > 0) {
      // L'email existe déjà en base de données
      return res.send('E-mail déjà enregistré.');
    } else {
      // L'email n'existe pas en base de données, procéder à l'inscription
      const insertSql = 'INSERT INTO users (nom, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [nom, email, password, role], (err, result) => {
        if (err) {
          console.error('Erreur lors de l\'inscription de l\'utilisateur :', err);
          return res.status(500).send('Erreur lors de l\'inscription de l\'utilisateur');
        }
        console.log('Utilisateur inscrit avec succès.');
        res.send('Inscription réussie !');
      });
    }
  });
});*/
//pour login 

// Route pour gérer la soumission du formulaire de connexion
app.post('/login', (req, res) => {
  const { mail, password } = req.body;// Récupérer les données du formulaire
  const sql = 'SELECT role FROM users WHERE email = ? AND password = ?';
  db.query(sql, [mail, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête de connexion :', err);
      return res.status(500).send('Erreur lors de la connexion : ' + err.message);
    }
    if (results.length > 0) {
      const role = results[0].role;
      if (role === 'admin') {
        res.redirect('/agenda'); // Redirection vers agenda.ejs pour les admins
      } else {
        res.redirect('/acceuil'); // Redirection vers accueil.ejs pour les utilisateurs normaux
      }
    } else {
      console.log('Utilisateur inscrit avec succès.');
        req.flash('message', 'mail ou mdp inccorect  !');
        res.redirect('/index');
    }
  });
});
// Route pour afficher l'agenda (pour les admins)
app.get('/agenda', (req, res) => {
  res.render('agenda');
});

// Route pour afficher l'accueil (pour les utilisateurs normaux)
app.get('/acceuil', (req, res) => {
  res.render('acceuil');
});

app.get('/test', (req, res) => {
  res.render('test');
});

app.get('/index', (req, res) => {
  res.render('index');
});
app.get('/utilisateur', (req, res) => {
  res.render('utilisateu');
});

// app.get('/stades', (req, res) => {
//   res.render('stades');
// });


// Route pour récupérer et afficher la liste des utilisateurs inscrits
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);// Envoyer la liste des utilisateurs en réponse
  });
});

// Démarrer le serveur sur le port 8000
app.listen(8000,function(){
  console.log("heard en 8000");
});





