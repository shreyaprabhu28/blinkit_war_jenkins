pipeline {
    agent any

    tools {
        maven 'maven'
    }

    environment {
        IMAGE_NAME = "shreyap2/blinkit-war-jenkins"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "blinkit-container"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Cloning project..."
                git branch: 'main',
                    url: 'https://github.com/shreyaprabhu28/blinkit_war_jenkins.git'
            }
        }

        stage('Build WAR') {
            steps {
                echo "Building WAR..."
                sh 'mvn clean package'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker Image..."
                sh 'sudo docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "$DOCKER_PASS" | sudo docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'sudo docker push $IMAGE_NAME:$IMAGE_TAG'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                sudo docker stop $CONTAINER_NAME || true
                sudo docker rm $CONTAINER_NAME || true

                sudo docker run -d \
                --name $CONTAINER_NAME \
                -p 8084:8080 \
                $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Docker Logout') {
            steps {
                sh 'sudo docker logout'
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
