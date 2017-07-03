# Downtime-Discord-Bot
A Discord bot for the Downtime community. If you don't know what this is, it is likely not intended for you.

# How to contribute
1. Fork this repository, and install node_modules with ``npm install``
2. Add your keys to a file called ``keys.yml`` in the main directory, based off of the pattern followed by ``keys.example.yml``
3. Create a new js file in the ``/modules`` folder
4. Require client from ``/client`` and write your bot hooks upon that
5. Add your module to ``/modules/index.js``
6. Push up to your own fork, make a pull request, then bug me.
