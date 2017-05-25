## Dev Diary

### Scaffold project

I decided to keep it real simple and use vanilla JS with script imports. No build system and I can focus on the core concepts. So I went with the following core libraries.

- **React** - of course.
- **Mobx** - My favorite state library, rock solid.
- **unfetch** - a tiny fetch polyfill from the creator of Preact.

For styles I put them all in a head style tag and use flexbox.  I like this setup, because it's minimal setup but with a ton of power.

I decided to create one app.js file.  I will build a model (a Mobx based model) and components.

Ok that looks pretty good.  

### Get something working

The principle of Mobx is `minimal state, derive everything else`.  So I created a model with some minimal state:

- `foundArtists` - holds an array of the found artists.
- `isShowingDetail` - are we displaying the grid of artist or a selected artist.
- `selectedArtist` - the actual artist selected by the user.

Everthing else can be computed from this.  If you haven't seen this in action with mobx, it's pretty cool.  We will derive things as we need them.

I added one action to fetch an initial list of artists and tested it out.  It returned artists. I then simply iterated over the results and showed their names in unstyled divs.

### Basic app flow/routing

The UI needs to be responsive.  I decided on 2 major components: a header search bar and grid of results.  When a user click on an item I expand the item on the grid.  When the user clicks the back arrow, I go back to the grid.  Simple UI made up of a `Grid` of `Artist` components.

Do we need a router?  With Mobx, routing is easy. The current view/route can simply be a function of state.  I added some computed properties on my model to return the right component and it's properties based on the state of the model and an action to toggle that view.  The app simply re-renders everytime things are toggled.

I added some flexbox css properties for the grid.  I modify the classname of the artist component based on whether it's selected or not.  At least that's a start, not sure if I need a separate detail Artist component or not.

Ok that's working nicely, we can toggle between a detail and grid view.

### Wire up the search bar

I still dont' have searching working: let's get that working.  

First I add an input to the header and style it is so it is nice and big and is full-width.  I remove the focus ring.

Now I take the naive approach and add onChange handler to the input.  I realize right away that I will need to throttle the user's input as they type so that we don't submit too many search requests.  So I bring in a debounce function and wrap my search cal in it.

Ok search is working pretty nicely.

####  Load tracks for an artist.

When the user selects an artist we want to show the top tracks for that artist in Australia. Let's show them in a list next to the user.  It would be nice to animate the selected user to the left but we will hold off on that for now.

First I create an observable in the model to hold the tracks for the currently selected user called `selectedArtistTracks`.  I add a function to load the tracks and call it when the view is toggled to detail.  It works on the first try!

Next I want to display these tracks in a simple list next to the user.  That shouldn't be that hard.  I simply create a new component called Track and map over the new observable to display it.  With the power of Mobx, this will be called at the right time.

There is some impact to the layout of the `Artist` component. It now needs to display 2 columns.  Instead of modifying the Artist component, I decide to wrap it in another component called `ArtistDetail`.

So this works nicely.  I add some margin and make sure I clear the results when clicking.  I also wrap each track with a link to the preview on Spotify.

#### Take a step back and see how I am doing

I then test things to see how usable they are.  I notice a couple glaring problems.  One there is no back button and 2 when you start typing a search in the detail view it doesn't go back to the grid.

So I fix those.  I then notice there are no placeholder images.  So I fix that.

I then notice there is no indicator for "no results".  I add that.

I then notice there are no loading indicators but I don't have time to add them and have worked on this a bit too long already.  So deploy to now.sh and test it on a real iPhone.





