pipeline {
    agent any

    parameters {
        string(name: 'DOCKERHUB_USERNAME', defaultValue: 'shreyap2')
        string(name: 'DOCKERHUB_REPO', defaultValue: 'webapp')
    }

    environment {
        IMAGE_NAME = "${params.DOCKERHUB_USERNAME}/${params.DOCKERHUB_REPO}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh "docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                sh """
                    docker push ${IMAGE_NAME}:latest
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Cleanup') {
            steps {
                sh """
                    docker rmi ${IMAGE_NAME}:latest || true
                    docker rmi ${IMAGE_NAME}:${BUILD_NUMBER} || true
                    docker image prune -f
                    docker logout
                """
            }
        }
    }

    post {
        success {
            echo "Docker image pushed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
