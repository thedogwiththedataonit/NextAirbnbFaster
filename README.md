### Airbnb Faster

Based off of NextFaster

[Using OpenAI to generate bnb data](https://github.com/thedogwiththedataonit/imageGenerator), feeding that into getImgAI to create images with flux, then storing the images in blob. Using prefetching and ISR to give a lighting fast experience in the web. 

## Key Features to make it blazingly fast
- Custom Link component that allows prefetching images on mouseEnter
- ISR on pages
- Caching queries
- Next Image Optimization

Who needs loading states when you got prefetching and caching!# NextAirbnbFaster.


### Environment variables (.env)

MONGODB_URI=""

MONGODB_DB=demo
