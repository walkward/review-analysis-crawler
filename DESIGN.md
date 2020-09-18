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

![Screenshot](crawler.png)

#### Highlights

* Automatic crawling retries.
* Automatic recovery from process crashes.
* Robust design based on Redis that can handle distributed job processing.
* Failed jobs are retained for reprocessing.

#### Controller Service

The controller service orchestrates the flow of processing beginning with the original input
and ends by returning the top three worst offenders. The controller takes a starting URL for
input and then proceeds as follow:

1. Queues the URL for crawling.
2. Queues the review for analysis.
3. Waits until crawler and analysis queues are empty.
4. Fetches the list of queue jobs and sorts them by descending score.
5. Returns the top three most overly positive endorsements.

#### Queue Service

A queue service is used to provide fault tolerance for both crawling and analysis processes.

#### Crawler Service

A crawler service is used for visiting web pages and extracting reviews.

Input example:

```json
{
  "url": "https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For-The-People-dealer-reviews-23685/page1",
  "page": 1,
  "maxPages": 5
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
      "user": "kary3092"
    }
  ]
}
```

#### Analysis Service

An analysis service is used for performing analysis on the review content.

Input example:

```json
{
  "review": {
    "title": "The perfect car!",
    "body": "I had a wonderful experience buying my super duper awesome car!",
    "date": "2020-11-10T07:00:00.000Z",
    "user": "kary3092"
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
    "user": "kary3092"
  },
  "analysis": {
    "score": 0.2
  }
}
```

#### Determining Fake Reviews

The analysis service uses a library named "Sentiment" which is a Node.js module that uses the AFINN-165 wordlist and Emoji Sentiment Ranking to perform sentiment analysis on arbitrary blocks of input text. AFINN is a list of words rated for valence with an integer between minus five (negative) and plus five (positive). Sentiment analysis is performed by cross-checking the string tokens (words, emojis) with the AFINN list and getting their respective scores. The comparative score is simply: sum of each token / number of tokens. Please note both the title text and body text are used for analysis.

## Technologies Used

- Docker
- Node.js
- Redis (queue)
- Osmosis (web scraper)
- Jest (testing)
