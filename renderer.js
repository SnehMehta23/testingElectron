document.getElementById("fileSelectorForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const clientID = document.getElementById("clientID").value;
    const subdirectory = document.getElementById("subdirectory").value;
    const files = Array.from(
      document.getElementById("imagesToUpload").files
    ).map((file) => file.path);

    // Call the 'getInput' function from the API object
    window.api.getInput(username, password, clientID, subdirectory, files)
      .then((responseData) => {
        console.log("Response from main process:", responseData);
        const { username, password, clientID, subdirectory, files } =
          responseData;
        // Handle response data if needed
      }).catch((error) => {
        console.error("Error:", error);
      });
  });
