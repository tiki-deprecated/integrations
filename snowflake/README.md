# TIKI <> Snowflake Integration

A Snowflake compatible external function for validating data licenses with TIKI.

Requires data in Snowflake (ACCOUNTADMIN privileges or a role with the CREATE INTEGRATION privilege.), corresponding license records in TIKI and
API Keys. Requires an AWS account w/ the ability to create API Gateway + Lambda using CF. Upload function to s3.

## How it works
It utilizes ptr records from your snowflake table to filter valid data licenses returning a boolean if that record has a valid license.

Works for millions rows, with pagination handled on the TIKI side. Only limits are Snowflake <> Lambda request payload size and Network Timeout.

given a table like:

`SELECT * FROM demo;`

| PTRs  | Field 1 | Field N |
|-------|---------|---------|
| 12345 | I'm     | a       |
| abcde | Little  | Teapot  |

where PTR `abcde` has a valid license and `12345` does not.

Adding the where clause
```
SELECT *
FROM demo
WHERE integrationFnName(ptr) = true;
```

then returns

| PTRs  | Field 1 | Field N |
|-------|---------|---------|
| abcde | Little  | Teapot  |


### Configure

1. set your api keys in tiki.js (get from console.mytiki.com)
2. set any static filters to include WITH your ptrs in index.js (comment)
```
const filters = {
    ptrs: [],
    tags: ["device_id"],
    // usecases: [],
    // destinations: [],
  };
```

### Deployment
This part is easy, but requires focus. It's easy to screw up. This is where we deploy the lambda/gateway via cloud formation (that's the easy part) and then create and link our external function in snowflake.

They've got a great step-by-step guide for you to follow, the only difference is instead of their cloud formation template, you're going to use the on in this repo. `/deploy/cloud-formation.yml`

https://docs.snowflake.com/en/sql-reference/external-functions-creating-aws-planning

### Call

`WHERE integrationFnName(ptr) = true;`

^ yes it really is that easy.

---

Special thanks to the Snowflake team (andrew & kyle) for helping get this up and running.
