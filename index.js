import * as Carousel from "./Carousel.js";
// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_8dSmIWu9bcEBuiIRS8ofyUD67Cbodup4dzL0xKhoD8Fi0KrodZxMi0jGSvBSQqU2";






// **
//  * 1. Create an async function "initialLoad" that does the following:
//  * - Retrieve a list of breeds from the cat API using fetch().
//  * - Create new <options> for each of these breeds, and append them to breedSelect.
//  *  - Each option should have a value attribute equal to the id of the breed.
//  *  - Each option should display text equal to the name of the breed.
//  * This function should execute immediately.
//  */



document.addEventListener('DOMContentLoaded',initialLoad)





async function initialLoad() {
    const res = await fetch('https://api.thecatapi.com/v1/breeds',
        {
           headers: {'x-api-key': API_KEY} 
        }
    );
    const data = await res.json();
    console.log(data);
    
    data.forEach(obj => {
        const option = document.createElement('option');
        option.textContent = obj.name;
        option.setAttribute('value', obj.id);
        breedSelect.appendChild(option);
    });
    
    axiosHandleBreedSelect();
}






//  * 2. Create an event handler for breedSelect that does the following:
// * - Retrieve information on the selected breed from the cat API using fetch().
// *  - Make sure your request is receiving multiple array items!
// *  - Check the API documentation if you're only getting a single object.
// * - For each object in the response array, create a new element for the carousel.
// *  - Append each of these new elements to the carousel.
// * - Use the other data you have been given to create an informational section within the infoDump element.
// *  - Be creative with how you create DOM elements and HTML.
// *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
// *  - Remember that functionality comes first, but user experience and design are important.
// * - Each new selection should clear, re-populate, and restart the Carousel.
// * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
// */


breedSelect.addEventListener('change', axiosHandleBreedSelect);


// set default headers
axios.defaults.headers.common['x-api-key'] = API_KEY;

async function axiosHandleBreedSelect() {
    console.log(breedSelect.value);

    const res = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedSelect.value}`,
      {
        onDownloadProgress: updateProgress,
        
    })
  
    // parsed json data
    const breedsData = res.data;
    console.log(breedsData);
  
    // clear the carousel if it has any images
    if (document.getElementById("carouselInner").firstChild) {
      Carousel.clear();
    }
  
    // create and append images to carousel
    breedsData.forEach((item) => {
      const element = Carousel.createCarouselItem(
        item.url,
        item.breeds[0].name,
        item.id,
      );
      Carousel.appendCarousel(element);
    });
  
    // check if there is a child element on the infoDump div
    if (infoDump.firstChild) {
      infoDump.firstChild.remove();
    }
  
    //TODO: be more creative
    // create a new element for the info
    const p = document.createElement("p");
    p.textContent = breedsData[0].breeds[0].description;
    infoDump.appendChild(p);
  
    // TODO
    Carousel.start()
  }

  //Interceptors

  axios.interceptors.request.use(request => {
    request.metadata = request.metadata || {};
    request.metadata.startTime = new Date().getTime();
    console.log('Sending Request.....');
    
    progressBar.style.width= '0px';
    //Sets the cursor to 'progress loading' (blue circle)
    document.body.style.cursor= `progress`;

    return request;
});

//Response Interceptors
axios.interceptors.response.use(
    (response) => {
        response.config.metadata.endTime = new Date().getTime();
        response.config.metadata.durationInMS = response.config.metadata.endTime - response.config.metadata.startTime;
        console.log('Response completed.....');
        //Sets the body cursor to default
        document.body.style.cursor=''
        

        console.log(`Request took ${response.config.metadata.durationInMS} milliseconds.`)
        return response;
    },
    (error) => {
        error.config.metadata.endTime = new Date().getTime();
        error.config.metadata.durationInMS = error.config.metadata.endTime - error.config.metadata.startTime;

        console.log(`Request took ${error.config.metadata.durationInMS} milliseconds.`)
        throw error;
});















// * 4. Change all of your fetch() functions to axios!
//  * - axios has already been imported for you within index.js.
//  * - If you've done everything correctly up to this point, this should be simple.
//  * - If it is not simple, take a moment to re-evaluate your original code.
//  * - Hint: Axios has the ability to set default headers. Use this to your advantage
//  *   by setting a default header with your API key so that you do not have to
//  *   send it manually with all of your requests! You can also set a default base URL!
//  */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */




 function updateProgress (progressEvent) {
    console.log(progressEvent);

    if (progressEvent.lengthComputable) {
        progressBar.style.width=progressEvent.total +'px';
        
    }
 }



















 export async function favourite(imgId) {
  // GET all favourites
axios.get("https://api.thecatapi.com/v1/favourites").then((res) => {
  console.log("FAVS => ", res.data);

  // loop over the items
  res.data.forEach((item) => {
      
      // if the image is favourited then delete
    if (item.image_id === imgId) {
      // delete
      axios.delete(`https://api.thecatapi.com/v1/favourites/${item.id}`);

  }
  });
});
}