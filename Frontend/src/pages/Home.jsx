import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl font-bold mb-6">Welcome to GA-TIS Project</h1>

        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About the Project</h2>
          <p className="mb-4">
            The Generative Adversarial Text-to-Image Synthesis (GA-TIS) project
            reimplements and enhances the foundational research on Conditional
            GANs for text-to-image synthesis, incorporating advancements in
            generative modeling and machine learning techniques.
          </p>
          <p>
            GA-TIS focuses on creating a pipeline for generating high-quality
            images from textual descriptions, integrating cutting-edge text
            embedding methods and optimized GAN architectures. The project also
            includes a user-friendly web application for real-time interaction,
            ensuring improved image quality and computational efficiency while
            addressing key challenges in image synthesis.
          </p>
        </section>

        {/* Team Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Mentors</h3>
              <ul className="list-disc ml-5">
                <li>
                  <a
                    href="https://www.linkedin.com/in/aaryan-patil-ds01/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Aaryan Patil
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/vedanth-nanesha-0591a42b4"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vedanth Nanesh
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Mentees</h3>
              <ul className="list-disc ml-5">
                <li>
                  <a
                    href="https://www.linkedin.com/in/sourabhkapure/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sourabh Kapure
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/akshaj-p-v-y-030266290/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Akshaj Polisetty
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/sarayu-narayanan-13ab41324/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sarayu Narayanan
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/sambhav-purohit"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sambhav Purohit
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/varshini-reddy-pateel-311460290/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Varshini Pateel
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="mb-2">Email: contact@gatis.com</p>
          <p className="mb-2">
            GitHub:{' '}
            <a
              href="https://github.com/ga-tis"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/ga-tis
            </a>
          </p>
        </section>

        {/* Try Now Button */}
        <div className="text-center">
          <Link to="/model">
            <Button className="px-6 py-2 bg-[#1f2937] text-white hover:bg-[#2d3748]">
              Try Text-to-Image Model
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
