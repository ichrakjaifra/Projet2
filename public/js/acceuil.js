// Sélectionne le bouton "suivant" dans le document
let nextBtn = document.querySelector('.next')

// Sélectionne le bouton "précédent" dans le document
let prevBtn = document.querySelector('.prev')

// Sélectionne l'élément "slider" dans le document
let slider = document.querySelector('.slider')

// Sélectionne la liste des éléments à l'intérieur du "slider"
let sliderList = slider.querySelector('.slider .list')

// Sélectionne l'élément "thumbnail" dans le document
let thumbnail = document.querySelector('.slider .thumbnail')

// Sélectionne tous les éléments "item" à l'intérieur de "thumbnail"
let thumbnailItems = thumbnail.querySelectorAll('.item')

// Ajoute le premier élément "item" à la fin de la liste "thumbnail"
thumbnail.appendChild(thumbnailItems[0])

// Fonction pour le bouton "suivant"
nextBtn.onclick = function() {
    moveSlider('next') // Appelle la fonction "moveSlider" avec le paramètre 'next'
}

// Fonction pour le bouton "précédent"
prevBtn.onclick = function() {
    moveSlider('prev') // Appelle la fonction "moveSlider" avec le paramètre 'prev'
}

// Fonction qui déplace le slider dans la direction spécifiée
function moveSlider(direction) {
    // Sélectionne tous les éléments "item" à l'intérieur de "sliderList"
    let sliderItems = sliderList.querySelectorAll('.item')
    // Sélectionne tous les éléments "item" à l'intérieur de "thumbnail"
    let thumbnailItems = document.querySelectorAll('.thumbnail .item')

    // Si la direction est "next" (suivant)
    if(direction === 'next'){
        // Déplace le premier élément "item" de "sliderList" à la fin
        sliderList.appendChild(sliderItems[0])
        // Déplace le premier élément "item" de "thumbnail" à la fin
        thumbnail.appendChild(thumbnailItems[0])
        // Ajoute la classe "next" à "slider" pour l'animation
        slider.classList.add('next')
    } else { // Si la direction est "prev" (précédent)
        // Déplace le dernier élément "item" de "sliderList" au début
        sliderList.prepend(sliderItems[sliderItems.length - 1])
        // Déplace le dernier élément "item" de "thumbnail" au début
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1])
        // Ajoute la classe "prev" à "slider" pour l'animation
        slider.classList.add('prev')
    }

    // Ajoute un écouteur d'événement pour l'animation
    slider.addEventListener('animationend', function() {
        // Si la direction est "next" (suivant)
        if(direction === 'next'){
            // Retire la classe "next" de "slider" après l'animation
            slider.classList.remove('next')
        } else { // Si la direction est "prev" (précédent)
            // Retire la classe "prev" de "slider" après l'animation
            slider.classList.remove('prev')
        }
    }, {once: true}) // Retire l'écouteur d'événement après qu'il ait été déclenché une fois
}





// let nextBtn = document.querySelector('.next')
// let prevBtn = document.querySelector('.prev')

// let slider = document.querySelector('.slider')
// let sliderList = slider.querySelector('.slider .list')
// let thumbnail = document.querySelector('.slider .thumbnail')
// let thumbnailItems = thumbnail.querySelectorAll('.item')

// thumbnail.appendChild(thumbnailItems[0])

// // Function for next button 
// nextBtn.onclick = function() {
//     moveSlider('next')
// }


// // Function for prev button 
// prevBtn.onclick = function() {
//     moveSlider('prev')
// }


// function moveSlider(direction) {
//     let sliderItems = sliderList.querySelectorAll('.item')
//     let thumbnailItems = document.querySelectorAll('.thumbnail .item')

//     if(direction === 'next'){
//         sliderList.appendChild(sliderItems[0])
//         thumbnail.appendChild(thumbnailItems[0])
//         slider.classList.add('next')
//     } else {
//         sliderList.prepend(sliderItems[sliderItems.length - 1])
//         thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1])
//         slider.classList.add('prev')
//     }


//     slider.addEventListener('animationend', function() {
//         if(direction === 'next'){
//             slider.classList.remove('next')
//         } else {
//             slider.classList.remove('prev')
//         }
//     }, {once: true}) // Remove the event listener after it's triggered once
// }