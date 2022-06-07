const thumbnail = require("./util");

const expect = require("chai").expect;


describe('Testing the Utils Functions', function() {

    let c1 = new thumbnail();

    it('1. Generate OTP', function(done) {
    
    expect(c1.generateOtp()).to.have.length(4);
    done();
    });

    it('2. Generate Random String' ,function(done){
        expect(c1.generateRandomString()).to.be.an("string")
        done();
    })
    

    it('3. Generate Encrypted Password' ,async function(){
        c1.generateEncryptedPassword("Hello").then((result)=>{
           return result
        });
    })

    it('4. Validate URL', function(done){
        expect(c1.validateURL("abc.com")).to.be.an("boolean")

        done();
    })

    });
