const searchButton = document.getElementById('search-button');
const queryInput = document.getElementById('query');
const key = 'e4f5d3b5780ea4fbdd3e455438bca265';
const imageGallery = document.getElementById('gallery');
const searchResults = document.getElementById('search-term');
const imgPerPage = document.getElementById('img-per-page');
const resultsArea = document.getElementById('img-results');
const pagesSection = document.getElementById('pages');
let noPerPage = 20;
let query = "";
let pageNo = 1;
let totalPages;

// Fetcha Flickr API med sökterm, key, antal per sida, sidnummer vid klick på sökknapp
let getImageList = async (query, noPerPage, pageNo) => {
    const response = await fetch(`https://api.flickr.com/services/rest?api_key=${key}&method=flickr.photos.search&text=${query}&per_page=${noPerPage}&page=${pageNo}&format=json&nojsoncallback=1`);
    const data = await response.json();
    console.log(data);
    getImages(data.photos.photo); 
    searchResults.innerHTML = `Total ${data.photos.total} images are found for: "${queryInput.value}"`; 
    totalPages = data.photos.pages;
}

//scrollista för att kunna välja antal bilder per sida 
let getScrollList = () => {
    const listLabel = document.createElement('label');
    listLabel.setAttribute('for', "drop-down-list");
    listLabel.innerHTML = 'Images per page: '
    imgPerPage.appendChild(listLabel);
    const dropDownList = document.createElement('select');
    dropDownList.setAttribute('id', "drop-down-list");
    dropDownList.innerHTML = `<option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>`
    imgPerPage.appendChild(dropDownList);
}


//visa bilderna      
let getImages = (images) => {
    resultsArea.innerHTML = "";

    images.forEach(image => { 
        let farmID = image.farm;
        let serverID = image.server;
        let imgID = image.id;
        let secret = image.secret;
        let altDesc = image.title;
        let imgURL = `https://farm${farmID}.staticflickr.com/${serverID}/${imgID}_${secret}_q.jpg`;
        const imageGalleryItem = document.createElement('figure'); 
        imageGalleryItem.setAttribute('id', "small-img");
        imageGalleryItem.innerHTML = `<img src="${imgURL}" alt="${altDesc}">` 
        resultsArea.appendChild(imageGalleryItem);

        imageGalleryItem.addEventListener('click', () => { //eventlyssnare för varje bild
            const overlay = document.getElementById('overlay');
            overlay.classList.toggle('hide'); 
            overlay.classList.add('overlay-fade');
            showLargeImage(farmID, serverID, imgID, secret); 
            document.querySelector('figcaption').innerHTML = image.title; 
            imageGalleryItem.innerHTML = `<img src="${imgURL}" alt="${altDesc}">`
            })
})
};

//funktion för att visa större bild
let showLargeImage = (farmID, serverID, imgID, secret) => { 
    const largeImage = document.getElementById('full-image');
    let largeImgURL = `https://farm${farmID}.staticflickr.com/${serverID}/${imgID}_${secret}.jpg` 
    largeImage.innerHTML = `<img src="${largeImgURL}">`
}

//eventlyssnare för sökknappen
searchButton.addEventListener('click', () => { 
    query = queryInput.value;
    getImageList(query, noPerPage, pageNo); 
    pageNo = 1; //börja alltid på sida 1 vid nytt sökord
    imageGallery.classList.remove('white-bg')
    document.getElementById('page-number').innerHTML = `Page ${pageNo}`
    document.getElementById('back').classList.add('hide'); 
    document.getElementById('forward').classList.remove('hide'); 

    //plocka fram inställningssektionerna ifall det är första sökningen
    if (imgPerPage.innerHTML === "") {
        getScrollList(); 
        pagesSection.classList.toggle('hide'); 
    };

    //eventlyssnare för val av antal bilder
    document.getElementById("drop-down-list").addEventListener('change', () => { 
        
        let perPage = document.getElementById("drop-down-list");
        pageNo = 1; 
        document.getElementById('page-number').innerHTML = `Page ${pageNo}` 
        noPerPage = perPage.value;
        getImageList(query, noPerPage, pageNo);
        document.getElementById('forward').classList.remove('hide');
        document.getElementById('back').classList.add('hide'); 
    });
    
    
});

//eventlyssnare på framåtpilen
document.getElementById('forward').addEventListener('click', () => { 
    if (pageNo === 1) { //ta bort Hide från bakåtpilen ifall vi var på sidan 1
        document.getElementById('back').classList.remove('hide');
    }

    if (pageNo < totalPages) { 
        pageNo += 1; 
        document.getElementById('page-number').innerHTML = `Page ${pageNo}` 
        getImageList(query, noPerPage, pageNo); 
    } 
    
    if (pageNo === totalPages) { //om vi är på sista sidan så göms framåtpilen
        document.getElementById('forward').classList.add('hide');
    } 
});

//eventlyssnare på bakåtpilen
document.getElementById('back').addEventListener('click', () => { 
    if (pageNo === totalPages) { //om vi är på sista sidan och klickar på bakåtpilen så tar vi fram framåtpilen
        document.getElementById('forward').classList.remove('hide');
    }

    if (pageNo > 1) { 
        pageNo -= 1; 
        document.getElementById('page-number').innerHTML = `Page ${pageNo}`
        getImageList(query, noPerPage, pageNo);
        if (pageNo === 1) { //om sidnumret blir 1 efter klick så göms bakåtpilen
            document.getElementById('back').classList.add('hide');
        }
    } 
});

// eventlyssnare på kryss för att stänga ner overlayen
document.getElementById('close').addEventListener('click', () => { 
    overlay.classList.toggle('hide'); 
    overlay.classList.remove('overlay-fade');
});



