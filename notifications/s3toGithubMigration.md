# webapp hosting migration: S3 to Github pages

I will be moving the site from s3 to github and during this process changing the react router component to a hash router to work with github pages.

## why is this relevant to users?
Urls pointing to specific pages on on shobu.link will break because i will be swapping to a hash router.


### url that will stop working
```
http://shobu.link/game/9eced310-1f6b-42cf-924c-97954918d9bc
```

### new version of url
```
https://shobu.link/#/game/9eced310-1f6b-42cf-924c-97954918d9bc
```

## are my games lost!?
no, games will not be lost, but url direct link to them will be different.

## why
So that shobu.link can use secure https for downloading the webapp.

## boring specifics
Aws S3 allows hosting a static site in an s3 bucket that is near free, but does not enable https by default if using a custom url (ie: shobu.link).  To enable https I would need to put the s3 bucket behind cloudfront which would cost more per request.

Github supports sites hosting static content in repositories, with https on custom domains, for free.  Awesome... but paths after a domain are expected to correlate with file structure of repository.  Using a hashrouter means makes links of the form `domain.com/#/path` so github resolves `domain.com/index.html` and react is passed `#/path` as a url argument.

## when will this happen?
conversion will happen on 2025-07-25.

You can access github version early at https://gh.shobu.link to test out hashrouter urls if you like.
