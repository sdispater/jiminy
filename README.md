# Jiminy

**Jiminy** is a PVR for newsgroup users (soon for torrents users as well) built with [MeteorJS](https://www.meteor.com/).
It can monitor release of new episodes of your favourite shows and will grab, sorts and renames them.
It can also be configured to automatically upgrade the quality of files already downloaded if a better quality format becomes available.

As of right now, it is not quite ready yet and some serious cleanup is necessary.

Here is a few things that are targeted for the 0.1 release:

* Automatic detection of new episodes
* Watching for better versions and upgrade quality
* Automatic failed download handling
* Configurable episode renaming
* Full integration with SABnzbd (other downloaders will be supported in the future)
* Precise episode download status and progress bar
* Application auto update


## Install

*For now no release is available, so you must use the master branch to test (At your own risks)*

Install [Meteor](http://docs.meteor.com/#quickstart). The link gives you all the information you need to get you started.

Clone the repository :

`git clone https://github.com/sdispater/jiminy`

In the project directory just do:

`meteor`

And the application should now run at `http://localhost:3000`.

Note that in order for Jiminy to fully work you need to have a running SABNzbd instance and configure indexers.
