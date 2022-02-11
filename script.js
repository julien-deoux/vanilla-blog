(function () {
  function generatePost(post) {
    /**
     * This function returns a DOM element based on the #posttemplate
     * template, filled with all the information necessary.
     */

    const template = document.getElementById('posttemplate');
    const postNode = template.content.firstElementChild.cloneNode(true);

    // Gathering the information we need
    const title = post.title.rendered;
    const link = post.link;
    const image = post.featured_media;
    const date = new Date(post.date);
    const author = {
      name: post._embedded.author[0].name,
      link: post._embedded.author[0].link,
    };
    const topic = post._embedded['wp:term'][2][0]?.name || 'General'; // Should be made cleaner by reading the API's documentation

    // Injecting the title
    const titleNode = postNode.querySelector('.jd-post-title');
    titleNode.setAttribute('href', link);
    titleNode.innerText = title;

    // Injecting the author
    const authorNode = postNode.querySelector('.jd-post-author');
    authorNode.setAttribute('href', author.link);
    authorNode.innerText = author.name;

    // Injecting the image
    const imageLinkNode = postNode.querySelector('.jd-post-image-link');
    imageLinkNode.setAttribute('href', link);
    const imageNode = postNode.querySelector('.jd-post-image');
    imageNode.setAttribute('alt', link);
    imageNode.setAttribute('src', image);

    // Injecting the date
    const dateNode = postNode.querySelector('.jd-post-date');
    dateNode.innerText = date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Injecting the topic
    const topicNode = postNode.querySelector('.jd-post-topic');
    topicNode.innerText = topic;

    return postNode;
  }

  function renderPost(post) {
    document.getElementById('posts').append(generatePost(post));
  }

  // Not bothering with error handling there, but ideally a message should
  // be displayed if the AJAX call fails.
  fetch('https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json')
    .then(response => response.json())
    .then(data => data.forEach(post => renderPost(post)));
})();
