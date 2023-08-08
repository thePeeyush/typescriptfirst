const username = document.getElementById('search') as HTMLInputElement;
const form = document.getElementById('form') as HTMLFormElement;
const main = document.getElementById('main') as HTMLElement;

interface User {
  html_url: string
  avatar_url: string
  login: string
}

const getUserData = async <T> (url: string):Promise<T> => {
  const userdata = await fetch(url);
  try {
    if (!userdata.ok) {
      noUserUI()
      throw new Error("error while fetching data from github api")
    }
    return userdata.json();
  } catch (error) {
    throw error
  }
}

const showusers = async () => {
  await getUserData<User[]>('https://api.github.com/users')
    .then(users => {
      users.map((user: User) => {
        showUser(user);
      })
    })
    .catch(err => {
      throw err
    })
}

const showUser = (user: User) => {
  const { avatar_url, login, html_url } = user;
  main.insertAdjacentHTML(
    "beforeend",
    `
    <a href="${html_url}">
    <div class="card">
        <img src="${avatar_url}" width="250" alt="${login}">
        <h2>${login}</h2>
    </div>
</a>

    `)
}

const noUserUI = () =>{
  main?.insertAdjacentHTML(
    "beforeend",
    `<p class="empty-msg">No matching users found.</p>`
  );
}

const searchUser = async (searchTerm:string) => {
  try {
    const users = await getUserData<User[]>('https://api.github.com/users')
    const matchedUser = users.filter(user=>{
    return user.login.toLowerCase().includes(searchTerm);
  })
  if (matchedUser.length === 0) {
    await getUserData<User>(`https://api.github.com/users/${searchTerm}`)
    .then(user=>showUser(user))
  }
  else{
    matchedUser.map((user: User) => {
      showUser(user);
    })
  }


  } catch (error) {
    throw error
  }  
}


window.addEventListener('load',showusers);

form.addEventListener('submit',(e)=>{
  e.preventDefault();
  main.innerHTML = "";
  const searchTerm = username.value.toLowerCase();
  searchUser(searchTerm);
});