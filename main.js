let cacheName = 'myCache-v1'
const fetchURL = 'https://picsum.photos/v2/list';
let cacheImgDiv = document.getElementById('cacheImg');

let cacheRef = null;


function init(){
    openCache();
    document.getElementById('fetchImg').addEventListener('click', () => {fetchAndCacheImage(fetchURL)});
    document.getElementById('loadCache').addEventListener('click', showImage);
}

async function openCache() {
    try {
      cacheRef = await caches.open(cacheName);
      console.log('cache opened');
    }
    catch(err) {
      console.log('fail to open cache ', err);
    }
  }

function fetchAndCacheImage(url) {
    fetch(url)
    .then((response) => {
      //response is a Response object
      if (!response.ok) throw new Error(response.statusText);
      console.log(response.status);
      return response.json();
    })
    .then((obj) => {
        // console.log(obj);

    // SAVE imageInfo as JSON format to cache

    for(let i=0; i< obj.length; i++){
        const imageInfoKey = "imageInfo_" + Date.now();
        const imageInfoJson = JSON.stringify(obj[i]);
        const responseJSON = new Response(imageInfoJson);
        // check if the images has been saved to cache
        
        cacheRef.put(imageInfoKey, responseJSON);
        }
    alert('images saved to cache');
    })
    .catch((err) => {
      console.warn(err.message);
    });
}

async function showImage() {
    try {
        const keys = await cacheRef.keys();

        if(keys.length === 0) {
            console.log('Cache is empty');
            return;
        } 

        for (const request of keys) {
            const response = await cacheRef.match(request);

            if(response) {
                const data = await response.json();
                console.log(data);
                // show images in the page
                let df = new DocumentFragment();
                let img = document.createElement('img');
                img.setAttribute('src', data.download_url);
                img.setAttribute('width', 200);
                img.setAttribute('id', data.id);
                df.append(img);
                cacheImgDiv.appendChild(df);
            };
        }
    }
    catch (error) {
        console.warn('Error occurs: ', error);
    }
};

document.addEventListener('DOMContentLoaded', init);