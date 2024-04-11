import express from "express";
import bodyParser from "body-parser";
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware.js";
import { DynamoDBClient, } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, } from "@aws-sdk/lib-dynamodb";
const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
let tableName = "ecProductsTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + "-" + process.env.ENV;
}
const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "id";
const partitionKeyType = "S";
const sortKeyName = "catageory";
const sortKeyType = "S";
const hasSortKey = true;
const path = "/products";
const UNAUTH = "UNAUTH";
const hashKeyPath = "/:" + partitionKeyName;
const sortKeyPath = hasSortKey ? "/:" + sortKeyName : "";
// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
// Enable CORS for all methods
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
// convert url string param to expected Type
const convertUrlType = (param, type) => {
    switch (type) {
        case "N":
            return Number.parseInt(param);
        default:
            return param;
    }
};
/************************************
 * HTTP Get method to list objects *
 ************************************/
app.get(path, async function (req, res) {
    var params = {
        TableName: tableName,
        Select: "ALL_ATTRIBUTES",
    };
    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        // data.Items
        res.json({ todo1: "todo1", todo2: "todo2" });
    }
    catch (err) {
        res.statusCode = 500;
        res.json({ error: "Could not load items: " + err.message });
    }
});
/************************************
 * HTTP Get method to query objects *
 ************************************/
// app.get(path + hashKeyPath, async function (req, res) {
//   const condition = {};
//   condition[partitionKeyName] = {
//     ComparisonOperator: "EQ",
//   };
//   if (userIdPresent && req.apiGateway) {
//     condition[partitionKeyName]["AttributeValueList"] = [
//       req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH,
//     ];
//   } else {
//     try {
//       condition[partitionKeyName]["AttributeValueList"] = [
//         convertUrlType(req.params[partitionKeyName], partitionKeyType),
//       ];
//     } catch (err) {
//       res.statusCode = 500;
//       res.json({ error: "Wrong column type " + err });
//     }
//   }
//   let queryParams = {
//     TableName: tableName,
//     KeyConditions: condition,
//   };
//   try {
//     const data = await ddbDocClient.send(new QueryCommand(queryParams));
//     res.json(data.Items);
//   } catch (err) {
//     res.statusCode = 500;
//     res.json({ error: "Could not load items: " + err.message });
//   }
// });
/*****************************************
 * HTTP Get method for get single object *
 *****************************************/
// app.get(
//   path + "/object" + hashKeyPath + sortKeyPath,
//   async function (req, res) {
//     const params = {};
//     if (userIdPresent && req.apiGateway) {
//       params[partitionKeyName] =
//         req.apiGateway.event.requestContext.identity.cognitoIdentityId ||
//         UNAUTH;
//     } else {
//       params[partitionKeyName] = req.params[partitionKeyName];
//       try {
//         params[partitionKeyName] = convertUrlType(
//           req.params[partitionKeyName],
//           partitionKeyType
//         );
//       } catch (err) {
//         res.statusCode = 500;
//         res.json({ error: "Wrong column type " + err });
//       }
//     }
//     if (hasSortKey) {
//       try {
//         params[sortKeyName] = convertUrlType(
//           req.params[sortKeyName],
//           sortKeyType
//         );
//       } catch (err) {
//         res.statusCode = 500;
//         res.json({ error: "Wrong column type " + err });
//       }
//     }
//     let getItemParams = {
//       TableName: tableName,
//       Key: params,
//     };
//     try {
//       const data = await ddbDocClient.send(new GetCommand(getItemParams));
//       if (data.Item) {
//         res.json(data.Item);
//       } else {
//         res.json(data);
//       }
//     } catch (err) {
//       res.statusCode = 500;
//       res.json({ error: "Could not load items: " + err.message });
//     }
//   }
// );
/************************************
 * HTTP put method for insert object *
 *************************************/
// app.put(path, async function (req, res) {
//   if (userIdPresent) {
//     req.body["userId"] =
//       req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   }
//   let putItemParams = {
//     TableName: tableName,
//     Item: req.body,
//   };
//   try {
//     let data = await ddbDocClient.send(new PutCommand(putItemParams));
//     res.json({ success: "put call succeed!", url: req.url, data: data });
//   } catch (err) {
//     res.statusCode = 500;
//     res.json({ error: err, url: req.url, body: req.body });
//   }
// });
/************************************
 * HTTP post method for insert object *
 *************************************/
// app.post(path, async function (req, res) {
//   if (userIdPresent) {
//     req.body["userId"] =
//       req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   }
//   let putItemParams = {
//     TableName: tableName,
//     Item: req.body,
//   };
//   try {
//     let data = await ddbDocClient.send(new PutCommand(putItemParams));
//     res.json({ success: "post call succeed!", url: req.url, data: data });
//   } catch (err) {
//     res.statusCode = 500;
//     res.json({ error: err, url: req.url, body: req.body });
//   }
// });
/**************************************
 * HTTP remove method to delete object *
 ***************************************/
// app.delete(
//   path + "/object" + hashKeyPath + sortKeyPath,
//   async function (req, res) {
//     const params = {};
//     if (userIdPresent && req.apiGateway) {
//       params[partitionKeyName] =
//         req.apiGateway.event.requestContext.identity.cognitoIdentityId ||
//         UNAUTH;
//     } else {
//       params[partitionKeyName] = req.params[partitionKeyName];
//       try {
//         params[partitionKeyName] = convertUrlType(
//           req.params[partitionKeyName],
//           partitionKeyType
//         );
//       } catch (err) {
//         res.statusCode = 500;
//         res.json({ error: "Wrong column type " + err });
//       }
//     }
//     if (hasSortKey) {
//       try {
//         params[sortKeyName] = convertUrlType(
//           req.params[sortKeyName],
//           sortKeyType
//         );
//       } catch (err) {
//         res.statusCode = 500;
//         res.json({ error: "Wrong column type " + err });
//       }
//     }
//     let removeItemParams = {
//       TableName: tableName,
//       Key: params,
//     };
//     try {
//       let data = await ddbDocClient.send(new DeleteCommand(removeItemParams));
//       res.json({ url: req.url, data: data });
//     } catch (err) {
//       res.statusCode = 500;
//       res.json({ error: err, url: req.url });
//     }
//   }
// );
app.listen(3000, function () {
    console.log("App started");
});
// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app;
