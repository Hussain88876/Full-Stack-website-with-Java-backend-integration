<script>
  import { COMMENTS_URL } from "$lib/js/api-urls";
  import { createEventDispatcher } from "svelte";

  export let data, article_id, parent_comment_id;

  const dispatch = createEventDispatcher();

  function commentChange(){
    dispatch(`comment`);
  }

  let desc;

  let error = false;
  let success = false;

  async function handleComment() {
    let user_id = data.user.user_id;

    if (!desc.trim()) {
      error = true;
      return;
    } else {
      try {
        const response = await fetch(COMMENTS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ desc, user_id, article_id, parent_comment_id })
        });

        if (response.status === 204) {
          success = true;
          desc = "";
          
          commentChange();

          setTimeout(() => {
          success = false;
        }, 1000);
        } else {
          error = true;
          desc = "";
          
          setTimeout(() => {
          error = false;
        }, 1000);
        }
      } catch (error) {
        console.error("Error posting comment: ", error);
        error = true;
        desc = "";
      }
    }
  }
</script>

<form on:submit|preventDefault={handleComment}>
  <textarea bind:value={desc} placeholder="Leave your comment here!"></textarea>
  <button on:submit={handleComment}>Post!</button>
  {#if error}<span class="error">Could not post!</span>{/if}
  {#if success}<span class="success" id="success">Posted!</span>{/if}
</form>

<style>
  textarea {
    width: 100%;
    background: #f7f7f7;
    border-radius: 6px;
  }

  form {
    padding: 10px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
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
    border-radius: 6px;
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
