## Description

The KGB has noticed a resurgence of overly excited reviews for a McKaig Chevrolet Buick,
a dealership they have planted in the United States. In order to avoid attracting unwanted
attention, this service should scrape reviews for this dealership from DealerRater.com
and uncover the top three worst offenders of these overly positive endorsements.

## Requirements

Functional Requirements:

1. Scrapes the first five pages of reviews.
2. Identifies the top three most “overly positive” endorsements.
3. Outputs these three reviews to the console, in order of severity.

## System Overview

#### Controller Service

The controller service orchestrates the flow of processing beginning with the original input
and ends by printing the top three worst offenders. Controller service should be provided an input
URL for the first page of reviews. The controller will queue the URL for crawling and then queue
the extracted reviews for processing. Finally when both the crawler and analysis queues are empty
the controller service will calculate and print the top three worst offenders of overly positive
endorsements.

#### Queue Service

A queue service is used to provide fault tolerance for both crawling and analysis processes.

#### Crawler Service

Input example:

```json
{
  "url": "https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For-The-People-dealer-reviews-23685/page1"
}
```

Output example:

```json
{
  "reviews": [
    {
      "title": "The perfect car!",
      "body": "I had a wonderful experience buying my super duper awesome car!",
      "date": "2020-11-10T07:00:00.000Z",
      "stars": 5
    }
  ]
}
```

#### Analysis Service

Input example:

```json
{
  "review": {
    "title": "The perfect car!",
    "body": "I had a wonderful experience buying my super duper awesome car!",
    "date": "2020-11-10T07:00:00.000Z",
    "stars": 5
  }
}
```

Output example:

```json
{
  "review": {
    "title": "The perfect car!",
    "body": "I had a wonderful experience buying my super duper awesome car!",
    "date": "2020-11-10T07:00:00.000Z",
    "stars": 5
  },
  "sentiment": {
    "score": 0.2,
    "numWords": 3,
    "numHits": 1
  }
}
```

#### Calculating Worst Offenders

## Technologies Used

- Docker
- Node.js
- Jest (testing)
