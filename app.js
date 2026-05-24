function login() {
    window.location.href = "/login"
}

async function unlock() {

    const password =
        document.getElementById("password").value

    const res = await fetch(
        "/verify-password",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password
            })
        }
    )

    const data = await res.json()

    if (data.success) {

        document
            .getElementById("download")
            .style.display = "block"

    } else {

        alert("Access Denied")

    }
}