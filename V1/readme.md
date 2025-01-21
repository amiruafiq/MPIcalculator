
## Step to run nodejs server
Go to terminal open directory ```/Users/afiqkurshid/Documents/GitHub/MPIcalculator/V1``` 

Run command ```node app.js``` - make sure already in folder
Ensure the server is running at http://localhost:3000:
Output: ```Server running on http://localhost:3000```



Homepage link
```http://localhost:3000/```

# Expected Output

After selecting the instance type, storage size, and clicking "Calculate," the estimated cost will be displayed.

## Example Output



### Project Structure
![alt text](img/1.png)
![alt text](img/2.png)


### After add 
EC2 hourly cost.
EC2 + storage hourly cost.
Monthly cost for 30 days.
Monthly cost with a 30% markup.
![alt text](img/3.png)


### only works

![alt text](img/4.png)


```http://localhost:3000/api/instances``` - address to check if instant call are success
![alt text](img/5.png)


```http://localhost:3000/api/pricing?instanceType=t4g.nano``` - address to check t4g.nano hourly rate
![alt text](img/6.png)



### Type of data API call

I will need to do data cleansing

![alt text](img/dataAPI-1.png)

![alt text](img/dataAPI-2.png)


### How big the data is?
![alt text](img/apicallviapostman.png)

-------------------------------

## As of now (16 Jan 2025)
1) Manage to call Instant type
2) Manage to call only t4g.nano & t4g.micro for hourly rate
3) However in main page it cant calculate yet