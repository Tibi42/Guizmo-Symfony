# Atomic Design - Composant Bouton

## Structure du projet

```
templates/
├── atoms/
│   └── buttons/
│       └── button.html.twig    # Composant bouton réutilisable
├── pages/
│   └── home/
│       └── button-example.html.twig    # Page d'exemple
```

## Comment utiliser le composant bouton

### 1. Inclusion basique

```twig
{% include 'atoms/buttons/button.html.twig' with {
    'text': 'Mon bouton'
} %}
```

### 2. Inclusion avec paramètres

```twig
{% include 'atoms/buttons/button.html.twig' with {
    'text': 'Valider',
    'type': 'submit',
    'class': 'btn-primary'
} %}
```

## Paramètres disponibles

| Paramètre  | Type    | Obligatoire | Défaut   | Description                                 |
| ---------- | ------- | ----------- | -------- | ------------------------------------------- |
| `text`     | string  | ✅          | -        | Texte affiché sur le bouton                 |
| `type`     | string  | ❌          | 'button' | Type HTML du bouton (button, submit, reset) |
| `class`    | string  | ❌          | ''       | Classes CSS supplémentaires                 |
| `disabled` | boolean | ❌          | false    | Désactive le bouton                         |

## Accéder à l'exemple

1. Démarrez votre serveur Symfony
2. Rendez-vous sur `/atomic-design/button`
3. Vous verrez tous les exemples d'utilisation du composant

## Principe de l'Atomic Design

-   **Atoms** : Composants de base (boutons, inputs, labels...)
-   **Molecules** : Combinaison d'atoms (formulaires, cartes...)
-   **Organisms** : Combinaison de molecules (header, footer...)
-   **Templates** : Structure de page avec des zones
-   **Pages** : Templates avec du contenu réel

Le bouton est un **atom** car c'est un élément de base qui ne peut pas être décomposé en éléments plus petits.
