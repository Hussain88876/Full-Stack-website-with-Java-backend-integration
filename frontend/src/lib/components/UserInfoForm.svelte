<script>
  import { invalidate } from "$app/navigation";
  import { USER_URL } from "$lib/js/api-urls.js";
  import { createEventDispatcher } from "svelte";
  import ImageUpload from "$lib/components/ImageUpload.svelte";
  import { writable } from "svelte/store";


  export let user;

  const dispatch = createEventDispatcher();

  let username = user.username;
  let dob = user.dob;
  let firstName = user.firstName;
  let lastName = user.lastName;
  let desc = user.desc;
  let avatar = user.avatar;
  let password = "";
  let error = false;
  let success = false;
  let images =writable(["/images/cat.png", "/images/duck.png", "/images/bunny.png", "/images/squirrel.png", "/images/bear.png", "/images/penguin.png"])

  function setImage(imgurl1) {
      avatar=imgurl1;
      console.log(avatar)
  
    }
    function handleUpload(event) {
      const { imageUrl } = event.detail;
      images.update(imgs => [...imgs, imageUrl]);
    }

  //once user clicks save, sends info to backend to be updated.
  async function handleSave() {
    const response = await fetch(`${USER_URL}/me`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, firstName, lastName, dob, password, desc, avatar })
    });

    success = response.status === 204;
    error = !success;

    if (success) invalidate(`${USER_URL}/me`);
    
    setTimeout(() => {
        dispatch("save");
      }, 700);
    
  }

  //cancel editing profile
  function cancel() {
    dispatch("cancel");
  }
</script>

<form on:submit|preventDefault={handleSave}>
  <label for="username">Username:</label>
  <input type="text" name="username" bind:value={username} required />
  <label for="firstName">First name:</label>
  <input type="text" name="firstName" bind:value={firstName} required />
  <label for="lastName">Last name:</label>
  <input type="text" name="lastName" bind:value={lastName} required />
  <label for="dob">Date of birth:</label>
  <input type="date" name="dob" bind:value={dob} required />
  <label for="password">Password:</label>
  <input type="text" name="password" bind:value={password} required />
  <textarea bind:value={desc} rows="12" required />

  <label for="profileAvatar">Profile Avatar:</label>
  <div>
    <div>
      {#each $images as imgurl1} 

      <label>
        <input type="radio" name="profileAvatar" value="1"  on:click={() => setImage(imgurl1)} required />
        <img src={imgurl1} alt="Profile Icon 1" />
      </label>
      
      {/each}
      <ImageUpload on:upload={handleUpload}/>

  <button type="submit">Save</button>
  <button type="button" on:click={cancel}>Cancel</button>
  {#if error}<span class="error">Could not save!</span>{/if}
  {#if success}
    <span class="success">Saved!</span>
  {/if}
</form>

<style>
  form {
    margin: auto;
    max-width: 800px;
    padding: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    max-height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
    }

    
  ::-webkit-scrollbar {
    width: 6px; 
  }

  
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1); 
    border-radius: 8px; 
  }

  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px; 
  }

  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5); 
  }

  img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.2s;
    }
  
    input[type="radio"] {
      display: none;
    }
  
    input[type="radio"]:checked + img {
      transform: scale(1.1);
    }

  button,
  textarea,
  .error,
  .success {
    grid-column: 1 / 3;
  }

  .error,
  .success {
    font-weight: bold;
    padding: 5px;
    text-align: center;
  }

  .error {
    color: darkred;
    background-color: lightcoral;
  }

  .success {
    color: darkgreen;
    background-color: lightgreen;
  }
</style>
