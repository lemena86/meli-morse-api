# MELI MORSE API
Api gateway to expose Meli Morse services via HTTP.

....

## Folder structure

```
.
├── api
│   └── *                           # api server code
├── test                            # api tests
└── *
```


## Testing locally
If you want to test this API locally you can follow these steps:

### Steps:
1. Clone this repo: `git clone https://lemena86@bitbucket.org/lemena86/meli-morse-api.git`
2. Move into dir `cd meli-morse-api`
3. Install dependencies `npm install`
4. Run it: `npm run coverage or npm run test`

## Running locally
If you want to run this API locally you can follow these steps:

### Steps:
1. Clone this repo: `git clone https://lemena86@bitbucket.org/lemena86/meli-morse-api.git`
2. Move into dir `cd meli-morse-api`
3. Install dependencies `npm install`
3. Run it: `npm run start`

### Examples
After this point you should have the api running locally on `http://localhost:3000`.

1. `http://localhost:3000/translate/2text` for translate from morse to human i.e. `curl -X POST "http://localhost:3000/translate/2text" -d '{"text": ".... --- .-.. .-  -- . .-.. .."}'`

2. `http://localhost:3000/translate/2morse` for translate from human to morse i.e. `curl -X POST "http://localhost:3000/translate/2morse" -d '{"text": "HOLA MELI"}'`

3. `http://localhost:3000/translate/bits2morse` for translate for bits to morse i.e. `curl -X POST "http://localhost:3000/translate/bits2morse" -d '{"text": "101010100110110110010110101001011000110110010010110101001010"}'`

4. `http://localhost:3000/translate/2bits` for translate from morse to bits i.e. `curl -X POST "http://localhost:3000/translate/2bits" -d '{"text": ".... --- .-.. .-  -- . .-.. .."}'`

5.  You can generate differents binary codes for the same morse you must specify the amount of `ones` for the `dots (.)` and for the `lines (-)`, `zeros` when it is separation of morse characters, separation of letters and separation of words. minOnes must be less than maxOnes, minZeros must be less or equal than mediumZeros, mediumZeros must be less than maxZeros.

i.e. `curl -X POST "http://localhost:3000/translate/2bits" -d '{"text": "-.-."}'` response `{"code":200,"response":"1101011010"}`

i.e. `curl -X POST "http://localhost:3000/translate/2bits" -d '{"text": "-.-.", "minOnes":"2", "maxOnes":"3"}'` response `{"code":200,"response":"11101101110110"}`

i.e. `curl -X POST "http://localhost:3000/translate/2bits" -d '{"text": "-.-. -..", "minOnes":"1", "maxOnes":"2", "minZeros":"2", "mediumZeros":"2","maxZeros":"3"}'` response `{"code":200,"response":"11001001100100001100100100"}`

i.e. `curl -X POST "http://localhost:3000/translate/2bits" -d '{"text": "-.-. -..", "minOnes":"1", "maxOnes":"2", "minZeros":"2", "mediumZeros":"3","maxZeros":"4"}'` response `{"code":200,"response":"110010011001000001100100100"}`
