 
// SELECT ELEMENTS
 

const searchInput = document.getElementById("search");
const suggestionBox = document.getElementById("suggestions");

const songs = document.querySelectorAll(".song-card");
const categories = document.querySelectorAll(".small-nav li");
const sidebarItems = document.querySelectorAll(".sidebar li");

const audios = document.querySelectorAll("audio");

const likeButtons = document.querySelectorAll(".like-btn");
const downloadButtons = document.querySelectorAll(".download-btn");



// LOAD SAVED DATA


let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
let downloadedSongs = JSON.parse(localStorage.getItem("downloadedSongs")) || [];
let recentSongs = JSON.parse(localStorage.getItem("recentSongs")) || [];


 
// RESTORE LIKE BUTTON STATE
 

songs.forEach(song=>{
  const name = song.dataset.name
  const likeBtn = song.querySelector(".like-btn")

  if(likedSongs.includes(name)){
    likeBtn.classList.add("liked")
    likeBtn.style.color = "red"
  }
})


 
// CATEGORY FILTER FUNCTION
 

function filterSongs(category){

  songs.forEach(song=>{

    if(category === "all")
      song.style.display = "block"

    else if(song.classList.contains(category))
      song.style.display = "block"

    else
      song.style.display = "none"

  })

}


 
// SIDEBAR CLICK FUNCTIONALITY
 

sidebarItems.forEach(item=>{

  item.addEventListener("click",()=>{

    sidebarItems.forEach(i=>i.classList.remove("active"))
    item.classList.add("active")

    const action = item.dataset.action


    // HOME / BROWSE / DISCOVER

    if(action==="home" || action==="browse" || action==="discover"){

      songs.forEach(song=>song.style.display="block")

    }


    // FAVORITES / LIKED

    else if(action==="favorites" || action==="liked"){

      let found = false

      songs.forEach(song=>{

        const name = song.dataset.name

        if(likedSongs.includes(name)){
          song.style.display="block"
          found=true
        }

        else
          song.style.display="none"

      })

      if(!found) alert("No liked songs yet!")

    }


    // DOWNLOADS

    else if(action==="downloads"){

      let found = false

      songs.forEach(song=>{

        const name = song.dataset.name

        if(downloadedSongs.includes(name)){
          song.style.display="block"
          found=true
        }

        else
          song.style.display="none"

      })

      if(!found) alert("No downloaded songs yet!")

    }


    // RECENTLY PLAYED

    else if(action==="recent"){

      let found = false

      songs.forEach(song=>{

        const name = song.dataset.name

        if(recentSongs.includes(name)){
          song.style.display="block"
          found=true
        }

        else
          song.style.display="none"

      })

      if(!found) alert("No recently played songs!")

    }


    // PLAYLIST FILTER

    else{

      songs.forEach(song=>{

        if(song.classList.contains(action))
          song.style.display="block"

        else
          song.style.display="none"

      })

    }

  })

})


 
// CATEGORY NAV CLICK
 

categories.forEach(button=>{

  button.addEventListener("click",()=>{

    categories.forEach(btn=>btn.classList.remove("active"))

    button.classList.add("active")

    filterSongs(button.dataset.category)

  })

})


 
// SEARCH SUGGESTIONS
 

const categoryList = ["chill","workout","happy","sad","study","party"]

searchInput.addEventListener("keyup",()=>{

  const value = searchInput.value.toLowerCase()

  suggestionBox.innerHTML=""

  if(!value){

    suggestionBox.style.display="none"
    return

  }

  const filtered = categoryList.filter(cat=>cat.includes(value))

  filtered.forEach(cat=>{

    const option = document.createElement("div")

    option.textContent = cat

    option.addEventListener("click",()=>{

      searchInput.value = cat

      suggestionBox.style.display="none"


      categories.forEach(btn=>btn.classList.remove("active"))

      categories.forEach(btn=>{
        if(btn.dataset.category === cat)
          btn.classList.add("active")
      })

      filterSongs(cat)

    })

    suggestionBox.appendChild(option)

  })

  suggestionBox.style.display="block"

})


 
// PLAY SONG + RECENTLY PLAYED
 

audios.forEach(audio=>{

  audio.addEventListener("play",()=>{

    audios.forEach(a=>{
      if(a!==audio) a.pause()
    })


    songs.forEach(card=>card.classList.remove("playing"))

    const songCard = audio.parentElement

    songCard.classList.add("playing")


    const songName = songCard.dataset.name


    if(!recentSongs.includes(songName))
      recentSongs.unshift(songName)

    if(recentSongs.length>20)
      recentSongs.pop()


    localStorage.setItem("recentSongs",JSON.stringify(recentSongs))

  })


  audio.addEventListener("pause",()=>{

    audio.parentElement.classList.remove("playing")

  })

})


 
// LIKE BUTTON
 

likeButtons.forEach(button=>{

  button.addEventListener("click",()=>{

    const songCard = button.closest(".song-card")

    const songName = songCard.dataset.name


    if(button.classList.contains("liked")){

      button.classList.remove("liked")

      button.style.color=""

      likedSongs = likedSongs.filter(name=>name!==songName)

    }

    else{

      button.classList.add("liked")

      button.style.color="red"

      if(!likedSongs.includes(songName))
        likedSongs.push(songName)

    }


    localStorage.setItem("likedSongs",JSON.stringify(likedSongs))

  })

})


 
// DOWNLOAD BUTTON
 

downloadButtons.forEach(btn=>{

  btn.addEventListener("click",()=>{

    const songCard = btn.closest(".song-card")

    const songName = songCard.dataset.name

    const audio = songCard.querySelector("audio")

    const source = audio.querySelector("source").src


    if(!downloadedSongs.includes(songName))
      downloadedSongs.push(songName)


    localStorage.setItem("downloadedSongs",JSON.stringify(downloadedSongs))


    const a = document.createElement("a")

    a.href = source

    a.download = source.split("/").pop()

    a.click()


    alert("Song downloaded!")

  })

})


 
// SCROLL ONLY MAIN SECTION
 

const mainContent = document.querySelector("main")
mainContent.style.overflow="hidden"

const songsSection = document.querySelector(".content")

songsSection.style.height="calc(100vh - 60px)"
songsSection.style.overflowY="auto"

songsSection.addEventListener("wheel",(e)=>{
  e.stopPropagation()
})