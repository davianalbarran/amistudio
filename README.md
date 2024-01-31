# AmiStudio

## Description
**AmiStudio** is a little project I'm making for my Software Frameworks course at Monmouth University. Picture Tamagotchi but with little RPG characters, called Ami(s), whose stats you can boost through various in-game actions!

## Technologies
### Purpose
The purpose of these technologies listed below are largely because they're languages I already have familiarity with and love, or I just really wanted to learn a specific framework (i.e. Tauri and Artix). I knew I didn't want to run Node+Express on the backend because it's boring not trying anything new, plus with the features I'm planning, having Rust on the backend should increase performance dramatically and reduce lag.

### Backend
**Tauri**
  * A Rust framework for developing faux-desktop applications running on a computer's default web engine.

**Artix**
  * A Rust library for quickly developing fast APIs. Will be needed for the Showdown functionality that is listed as one of the roadmapped feautres.

### Database
**PostgreSQL**
  * An iteration on the very common SQL database modeling language. Will be used for storing Ami stats, as well as user's Renown (in-game point system), and various other data that will need to be stored.

### Frontend
**React**
  * React surely needs no introduction, but I mainly chose it since I have experience building user interfaces with it and I believe it'll speed up the development.