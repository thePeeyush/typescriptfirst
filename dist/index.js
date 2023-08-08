"use strict";
const username = document.getElementById('search');
const form = document.getElementById('form');
const main = document.getElementById('main');
const getUserData = async (url) => {
    const userdata = await fetch(url);
    try {
        if (!userdata.ok) {
            noUserUI();
            throw new Error("error while fetching data from github api");
        }
        return userdata.json();
    }
    catch (error) {
        throw error;
    }
};
const showusers = async () => {
    await getUserData('https://api.github.com/users')
        .then(users => {
        users.map((user) => {
            showUser(user);
        });
    })
        .catch(err => {
        throw err;
    });
};
const showUser = (user) => {
    const { avatar_url, login, html_url } = user;
    main.insertAdjacentHTML("beforeend", `
    <a href="${html_url}">
    <div class="card">
        <img src="${avatar_url}" width="250" alt="${login}">
        <h2>${login}</h2>
    </div>
</a>

    `);
};
const noUserUI = () => {
    main?.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching users found.</p>`);
};
const searchUser = async (searchTerm) => {
    try {
        const users = await getUserData('https://api.github.com/users');
        const matchedUser = users.filter(user => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        if (matchedUser.length === 0) {
            await getUserData(`https://api.github.com/users/${searchTerm}`)
                .then(user => showUser(user));
        }
        else {
            matchedUser.map((user) => {
                showUser(user);
            });
        }
    }
    catch (error) {
        throw error;
    }
};
window.addEventListener('load', showusers);
form.addEventListener('submit', (e) => {
    e.preventDefault();
    main.innerHTML = "";
    const searchTerm = username.value.toLowerCase();
    searchUser(searchTerm);
});
