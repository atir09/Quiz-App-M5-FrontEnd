
let URL = "https://quiz-app-mock-5-atir.onrender.com"
let loader = document.querySelector(".spin-container")

let form = document.querySelector("form")

form.addEventListener("submit", (e) => {
    e.preventDefault()

    let username = form.username.value
    let email = form.email.value

    loader.style.display = "block"
    fetch(`${URL}/user`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,email})
    })
        .then(async (res) => {
            loader.style.display = "none"
            try {
                let data = await res.json()
                return { data, status: res.status }
            } catch (error) {
                console.log(error)
                alert(error.message)
            }
        })
        .then((res) => {
            if (res.status == 201) {
                alert(res.data.msg)
                localStorage.setItem("email",JSON.stringify(email))
                window.location.href = "html/dashboard.html";
            } else {
                alert(res.data.msg)
            }
        })
        .catch((err) => {
            console.log(err)
            loader.style.display = "none"
        })
})