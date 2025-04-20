import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Truck, RotateCcw, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* About Hero */}
      <section className="mb-16">
        <div className="bg-primary rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 lg:p-16 flex items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About ShopEase</h1>
                <p className="text-white/90 text-lg mb-6">
                  Your one-stop destination for quality products and exceptional shopping experience.
                  We're dedicated to providing the best products at unbeatable prices.
                </p>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/products">Shop Now</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1620694563886-c1b2d72e7483?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Our team" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Company founding" 
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">From Humble Beginnings</h3>
            <p className="text-gray-600 mb-4">
              Founded in 2015, ShopEase began as a small online store with a vision to make quality products accessible to everyone. What started as a passion project in a small apartment has grown into a trusted e-commerce platform serving thousands of customers.
            </p>
            <p className="text-gray-600">
              Our commitment to customer satisfaction, quality products, and competitive prices has helped us build a loyal customer base. We carefully curate our product selection to ensure that every item meets our high standards before it reaches your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16 bg-gray-50 py-12 px-6 rounded-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
            <p className="text-gray-600">
              We never compromise on quality. Each product is carefully selected and tested to ensure it meets our high standards.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliability</h3>
            <p className="text-gray-600">
              We deliver on our promises. From accurate product descriptions to timely shipping, we ensure a reliable shopping experience.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Focus</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do. We continuously improve based on your feedback and needs.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16" id="faq">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-medium">
                How long does shipping take?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Standard shipping typically takes 3-5 business days within the continental US. 
                International shipping can take 7-14 business days depending on the destination. 
                For more specific information, please check the shipping details during checkout.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg font-medium">
                What is your return policy?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                We offer a 30-day return policy for most items. Products must be returned in their 
                original condition and packaging to be eligible for a full refund. Some items may 
                be subject to a restocking fee. Please visit our <Link href="/about#shipping" className="text-primary hover:underline">Shipping & Returns</Link> page for more details.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-medium">
                How can I track my order?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Once your order ships, you will receive a confirmation email with tracking information. 
                You can also log in to your account and check the status of your order in the 
                <Link href="/profile" className="text-primary hover:underline mx-1">My Orders</Link> 
                section of your profile.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg font-medium">
                Do you ship internationally?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, we ship to most countries worldwide. International shipping rates and delivery times 
                vary by location. Import duties and taxes may apply and are the responsibility of the customer.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-lg font-medium">
                How do I contact customer service?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our customer service team is available Monday through Friday from 9am to 5pm EST. 
                You can reach us by email at support@shopease.com or by using the contact form 
                on our website. We typically respond to all inquiries within 24 business hours.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Shipping & Returns */}
      <section className="mb-16 bg-gray-50 py-12 px-6 rounded-lg" id="shipping">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping & Returns</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Policy</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <Truck className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Free standard shipping on all orders over $50</span>
              </li>
              <li className="flex items-start">
                <Truck className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Standard shipping (3-5 business days): $5.99</span>
              </li>
              <li className="flex items-start">
                <Truck className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Express shipping (1-2 business days): $12.99</span>
              </li>
              <li className="flex items-start">
                <Truck className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>International shipping available to most countries</span>
              </li>
              <li className="flex items-start">
                <Truck className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Orders are processed within 1-2 business days</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Return Policy</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <RotateCcw className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>30-day return policy for most items</span>
              </li>
              <li className="flex items-start">
                <RotateCcw className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Items must be in original condition with tags attached</span>
              </li>
              <li className="flex items-start">
                <RotateCcw className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Return shipping is the responsibility of the customer unless the item is defective</span>
              </li>
              <li className="flex items-start">
                <RotateCcw className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Refunds are processed within 5-7 business days after receiving the returned item</span>
              </li>
              <li className="flex items-start">
                <RotateCcw className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Some items marked as final sale cannot be returned</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help. Reach out to us using any of the methods below.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-2">For general inquiries:</p>
            <a href="mailto:info@shopease.com" className="text-primary hover:underline">info@shopease.com</a>
            <p className="text-gray-600 mt-2 mb-2">For customer support:</p>
            <a href="mailto:support@shopease.com" className="text-primary hover:underline">support@shopease.com</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-2">Customer Service:</p>
            <a href="tel:+18001234567" className="text-primary hover:underline">1-800-123-4567</a>
            <p className="text-gray-600 mt-4 mb-2">Hours of Operation:</p>
            <p className="text-gray-600">Monday-Friday: 9am - 5pm EST</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Location</h3>
            <p className="text-gray-600">
              123 Commerce Street<br />
              Suite 500<br />
              New York, NY 10001<br />
              United States
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Banner */}
      <section className="mb-8">
        <div className="bg-primary rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Discover our wide range of quality products at competitive prices. Join thousands of satisfied customers today!
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
