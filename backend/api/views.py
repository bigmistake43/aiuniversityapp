from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
import logging
import openai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from openai import OpenAI
from .models import SavedPrompt, UniversityFactSheet, ChatSession, ChatMessage, FileAttachment
from markdown import markdown
import re
from .serializers import ChatSessionSerializer, ChatMessageSerializer, FileAttachmentSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework import viewsets
from uuid import uuid4
from .ai_service import generate_chatbot_response 
from django.conf import settings

client = OpenAI(
    api_key="API-key", # Replace with your OpenAI API key
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('my_custom_logger')
logger.setLevel(logging.INFO)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        if User.objects.filter(username=request.data.get('username')).exists():
            return Response(
                {"message": "The username is already taken. Please choose another one."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if User.objects.filter(email=request.data.get('email')).exists():
            return Response(
                {"message": "An account with this email already exists. Please use another email."},
                status=status.HTTP_400_BAD_REQUEST
            )

        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {"message": f"The {field} field is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        password = request.data.get('password')
        if password and len(password) < 8:
            return Response(
                {"message": "Password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = request.data.get('email')
        if email and "@" not in email:
            return Response(
                {"message": "Please provide a valid email address."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response(
                {
                    "message": "You have successfully registered!",
                    "username": user.username,
                    "email": user.email,
                    "access": access_token,
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "There was an error with your registration. Please check the provided data."},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def send_text_before_login(request):
    if request.method == 'POST':
        
        try:
            user_message = request.data.get('message', '')
            if not user_message:
                return Response({'error': 'User message is required.'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': 'Response generated successfully', 'reply': "message has received"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error generating response: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['POST'])
@permission_classes([AllowAny])
def send_text_after_login(request):
    if request.method == 'POST':
        try:
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required to retrieve prompt.'}, status=status.HTTP_400_BAD_REQUEST)

            saved_prompt, created = SavedPrompt.objects.get_or_create(email=email)

            user_message = request.data.get('message', '')
            if not user_message:
                return Response({'error': 'User message is required.'}, status=status.HTTP_400_BAD_REQUEST)

            saved_prompt.messages.append({"role": "user", "content": user_message})

            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant specializing in university recommendations."}
                ] + saved_prompt.messages,
                model="gpt-4o-mini",
            )
            ai_reply = chat_completion.choices[0].message.content

            # Convert Markdown to HTML
            html_reply = markdown(ai_reply)

            saved_prompt.messages.append({"role": "assistant", "content": ai_reply})
            saved_prompt.save()

            return Response({'message': 'Response generated successfully', 'reply': html_reply}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error generating response: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def university_finder_message(request):
    if request.method == 'POST':
        try:
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required to retrieve prompt.'}, status=status.HTTP_400_BAD_REQUEST)

            saved_prompt, created = SavedPrompt.objects.get_or_create(email=email)

            user_message = "I want to change or confirm my previous selections for my dream university."

            saved_prompt.messages.append({"role": "user", "content": user_message})

            assistant_message = "This platform will help you choose your university based on your choices in the questionnaire and your additional requirements. Please ensure that your previous choices are accurate; if not, kindly mention that here. You can also provide more detailed requirements for your dream university. We are here to help you."

            # Convert Markdown to HTML
            html_reply = markdown(assistant_message)

            saved_prompt.messages.append({"role": "assistant", "content": assistant_message})
            saved_prompt.save()

            return Response({'message': 'Response generated successfully', 'reply': html_reply}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error generating response: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def Save_University_Fact_Sheet(request):
    if request.method == 'POST':
        try:
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required to retrieve prompt.'}, status=status.HTTP_400_BAD_REQUEST)

            saved_prompt, created = SavedPrompt.objects.get_or_create(email=email)

            user_message = "I want to change or confirm my previous selections for my dream university."

            saved_prompt.messages.append({"role": "user", "content": user_message})

            assistant_message = """
                <p style="font-size: 18px; color: #FFF; line-height: 1.6;">This platform will help you save the university fact sheets so that you can view your favorite university fact sheets later. Would you like to start saving them? This platform allows you to select just the necessary fact sheet items for the university and generate a customized table for you.</p>
                <button onclick="window.location.href='http://localhost:3000/save_university_facsheet/';"style="background-color: #4CAF50; color: white; padding: 12px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease;">Yes, start saving the University Fact Sheet
                </button>
            """

            html_reply = assistant_message

            saved_prompt.messages.append({"role": "assistant", "content": html_reply})
            saved_prompt.save()

            return Response({'message': 'Response generated successfully', 'reply': html_reply}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error generating response: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class QuestionnaireView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            data = request.data


            required_fields = [
                'firstName', 'email', 'citizenship', 'gradePointAverage',
                'interestedDegree', 'interestedStudy', 'country', 
                'wantFinancialAid', 'academicImportance', 
                'importanceOfTuitionFees', 'importanceOfSocialCulturalFactor', 
                'tuitionBudget'
            ]

            for field in required_fields:
                if field not in data:
                    return Response(
                        {'error': f'Missing required field: {field}'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Prepare the messages for saving as a conversation
            messages = [
                {"role": "system", "content": "What is your first name?"},
                {"role": "user", "content": f"{data.get('firstName')}"},
                {"role": "system", "content": "What is your email?"},
                {"role": "user", "content": f"{data.get('email')}"},
                {"role": "system", "content": "What citizenship do you hold?"},
                {"role": "user", "content": f"{data.get('citizenship')}"},
                {"role": "system", "content": "What is your current Grade Point Average?"},
                {"role": "user", "content": f"{data.get('gradePointAverage')}"},
                {"role": "system", "content": "What level of degree are you interested in?"},
                {"role": "user", "content": f"{', '.join(data.get('interestedDegree', []))}"},
                {"role": "system", "content": "What would you like to study?"},
                {"role": "user", "content": f"{data.get('interestedStudy')}"},
                {"role": "system", "content": "Which country would you like to study in?"},
                {"role": "user", "content": f"{data.get('country')}"},
                {"role": "system", "content": "Are you interested in financial aid?"},
                {"role": "user", "content": f"{'Yes' if data.get('wantFinancialAid') else 'No'}"},
                {"role": "system", "content": "How important is the university’s academic reputation to you when applying?"},
                {"role": "user", "content": f"{data.get('academicImportance')}"},
                {"role": "system", "content": "How important are the university tuition fees for you?"},
                {"role": "user", "content": f"{data.get('importanceOfTuitionFees')}"},
                {"role": "system", "content": "How important is the social/cultural factor when selecting a university?"},
                {"role": "user", "content": f"{data.get('importanceOfSocialCulturalFactor')}"},
                {"role": "system", "content": "What is your maximum annual budget that you can spend on tuition costs?"},
                {"role": "user", "content": f"{data.get('tuitionBudget')}"}
            ]

            # Save the messages as a conversation in the SavedPrompt model
            saved_prompt, created = SavedPrompt.objects.get_or_create(user=user)
            saved_prompt.messages = messages  # Save the messages to the database
            saved_prompt.save()

            return Response(
                {
                    'message': 'Questionnaire submitted successfully',
                    'generated_prompt': messages
                },
                status=status.HTTP_201_CREATED
            )
        
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@csrf_exempt
def generate_response(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            prompt = data.get('prompt', '')

            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            reply = response['choices'][0]['message']['content']
            return JsonResponse({"reply": reply}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=400)

import json

@api_view(['POST'])
@permission_classes([AllowAny])
def SaveUniversityFacSheet(request):
    if request.method == 'POST':
        try:
            # Extract email from the request
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Find the user based on the provided email
            saved_prompt, created = SavedPrompt.objects.get_or_create(email=email)

            # Extract the university name and selected facts
            university_name = request.data.get('university_name')
            selected_facts = request.data.get('selected_facts', [])

            if not university_name:
                return Response({'error': 'University name is required.'}, status=status.HTTP_400_BAD_REQUEST)

            if not selected_facts:
                return Response({'error': 'At least one selected fact is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Create the prompt for OpenAI API call
            user_message = f"""
            Provide detailed information about the following facts for {university_name}.
            Respond only in a valid JSON format where each fact is a key and its details are the value.
            Do not include any additional text or formatting like Markdown.
            Facts: {', '.join(selected_facts)}
            
            Example response:
            {{
                "Location": "The location details...",
                "Programs Offered": "Details about programs offered..."
            }}
            """
            saved_prompt.messages.append({"role": "user", "content": user_message})

            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant specializing in university recommendations."}
                ] + saved_prompt.messages,
                model="gpt-4o-mini",
            )
            ai_reply = chat_completion.choices[0].message.content

            # Parse the AI response into a dictionary
            try:
                # Remove Markdown-style triple backticks and any non-JSON text
                cleaned_response = re.sub(r'```json|```', '', ai_reply).strip()
                facts_with_answers = json.loads(cleaned_response)  # Parse the cleaned JSON response
                if not isinstance(facts_with_answers, dict):
                    raise ValueError("AI response is not a valid dictionary.")
            except json.JSONDecodeError as json_error:
                return Response({'error': 'AI response format error. Unable to process.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except ValueError as value_error:
                return Response({'error': 'AI response validation error. Unable to process.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Save the university fact sheet
            university_fact_sheet = UniversityFactSheet.objects.create(
                email=email,
                university_name=university_name,
                facts=facts_with_answers
            )

            return Response({
                'message': 'University fact sheet saved successfully',
                'university_fact_sheet': {
                    'university_name': university_fact_sheet.university_name,
                    'facts': university_fact_sheet.facts
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Error generating response: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# backend/api/views.py

CHAT_TYPE_QUESTIONS = {
    'general': [
        "Thank you for reaching out! Could you please let me know what you're looking for or what your query is? This will help me provide the best assistance possible.",
        "Is there any additional detail you'd like to share? The more information you provide, the better I can assist you in finding the right solution."
    ],
    'university_finder': [
        "I'd love to help you find the perfect university! To start, could you please let me know what course or program you're interested in studying? This will allow me to narrow down the options to the most relevant ones for you.",
        "In which region would you ideally like to study? If you're flexible, that's completely fine too! Just let me know if you have any preferences.",
        "Are there any particular cities that you'd like to consider for studying? If you have a dream location in mind, I can help you explore universities there.",
        "Would you be interested in knowing more about financial aid options for your studies? I can provide information on scholarships, grants, or other financial support that may be available to you."
    ],
    'scholarship_finder': [
        "Are you currently looking for scholarships related to a specific university? If you already have a university in mind, I can help you find scholarships available for that institution.",
        "Which regions or countries are you most interested in finding scholarships for? Let me know your preferences so I can suggest the best options for you.",
        "Is there any specific information you'd like me to consider when finding relevant scholarships? For example, your academic background, financial needs, or any other criteria that might help in matching you with the best scholarships."
    ],
    'document_generator': [
        "I can help you create the perfect document! Please let me know which type of document you'd like me to generate for you. Here are some options to consider: Admissions Letter, Email, Letter of Recommendation, or a University Essay.",
        "If you're interested in an Admissions Letter, could you please let me know which university you're applying to? This will help me tailor the letter to the specific institution.",
        "For the Email document, what information would you like to inquire about or request in the email? Also, which university is this email intended for, and who would the email be addressed to?",
        "For the Letter of Recommendation, can you share with me the name and position of the person who will be writing it? Also, if you have any notable achievements or experiences you'd like mentioned, feel free to share them!",
        "If you're working on a University Essay, I'd be happy to assist. Could you tell me the subject or title of the essay? And how long would you like it to be? This helps me structure it according to your needs."
    ],
    'course_matching': [
        "I'd love to help you find the best course recommendations! To begin, could you share with me your academic interests and career goals? This will help me match you with courses that align with your future aspirations.",
        "Can you provide me with a bit more about your academic background? Knowing what you've studied so far helps me recommend courses that fit your level and experience.",
        "Before I suggest any courses, is there any additional information you'd like me to consider? For instance, do you have a preferred location for your studies, or a specific budget in mind for tuition fees? Let me know, and I'll take that into account while making suggestions."
    ],
    'location_info': [
        "I can assist you with detailed information about any location you're interested in. Could you please let me know which city or region you'd like to learn more about? The more specific, the better!",
        "What kind of information are you looking for about this location? Are you interested in details like cost of living, job opportunities, cultural attractions, or something else? Feel free to be as specific as you'd like."
    ],
    'university_fac_sheet': [
        "To help you find the right university, could you please tell me which one you're interested in learning more about? This will allow me to provide you with specific information about that institution.",
        "What course are you hoping to study at this university? If you haven't decided on a course yet, that's totally okay! Just let me know if you're looking for general information about the university.",
        "Do you have any specific requirements or preferences when it comes to the university? For example, are you looking for information on campus facilities, faculty, student life, or something else?",
        "I can also provide detailed information on important dates like semester start dates, application deadlines, fees (tuition, application, etc.), visa requirements, and any documents you need for the application. What would you like to know more about?"
    ]
}

def get_file_binary(file_path):
        with open(file_path, 'rb') as file:
            return file.read()

class ChatSessionViewSet(viewsets.ModelViewSet):
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).prefetch_related('messages')

    @action(detail=False, methods=['get'])
    def my_sessions(self, request):
        sessions = self.get_queryset().order_by('-updated_at')
        serializer = self.get_serializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        VALID_CHAT_TYPES = [
            'general', 'university_finder', 'scholarship_finder',
            'document_generator', 'course_matching', 'location_info', 'university_fac_sheet'
        ]
        session_id = str(uuid4())
        chat_type = request.data.get('chat_type', 'general')

        if chat_type not in VALID_CHAT_TYPES:
            return Response({'error': 'Invalid chat type.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the saved questionnaire data
        saved_prompt = SavedPrompt.objects.filter(user=request.user).first()
        if saved_prompt:
            base_prompt = saved_prompt.messages
        else:
            base_prompt = [
                {"role": "system", "content": "No questionnaire data found for the user."}
            ]

        session = ChatSession.objects.create(
            user=request.user,
            session_id=session_id,
            chat_type=chat_type,
            base_prompt=base_prompt
        )
        
        return Response(
            ChatSessionSerializer(session).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        session = get_object_or_404(ChatSession, pk=pk, user=request.user)
        message = request.data.get('message')
        sender = request.data.get('sender', 'user')
        files = request.FILES.getlist('files')

        if not files:
            logger.info("No files uploaded.")

        if not message:
            return Response({
                'messages': ChatMessageSerializer(session.messages.all(), many=True).data,
                'error': 'Message content is required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Handle file attachments
        file_attachments = []
        for file in files:
            if file.size > 10 * 1024 * 1024: 
                 # Example size limit of 10MB
                return Response({
                    'messages': ChatMessageSerializer(session.messages.all(), many=True).data,
                    'error': f'File {file.name} exceeds the size limit.'
                }, status=status.HTTP_400_BAD_REQUEST)

            file_attachment = FileAttachment.objects.create(
                session=session,
                file=file,
                file_type=file.content_type
            )
            file_attachments.append(file_attachment)
    
        # Save user's message
        user_message = ChatMessage.objects.create(
            session=session,
            message=message,
            sender=sender
        )
        user_message.file_attachments.add(*file_attachments)

        # Step 1: Handle session questions
        chat_type = session.chat_type
        questions = CHAT_TYPE_QUESTIONS.get(chat_type, [])

        # Check if this is the first interaction in the session
        if session.current_question_index == 0 and questions:
            first_question = questions[0]

            # Save the chatbot's question as a message
            chatbot_message = ChatMessage.objects.create(
                session=session,
                message=first_question,
                sender='chatbot'
            )
            
            # Update the session's current_question_index to point to the next question
            session.current_question_index += 1
            session.save()
    
            # Respond with both the user's message and the chatbot's first question
            return Response({
                'messages': ChatMessageSerializer(session.messages.all(), many=True).data,
                'error': None
            }, status=status.HTTP_200_OK)

        # Save the user's answer to the current question
        if session.current_question_index < len(questions):
            current_question = questions[session.current_question_index - 1]
            session.answered_questions.append({
                'question': current_question,
                'answer': message,
            })
            session.current_question_index += 1  # Move to the next question
            session.save()

            # If more questions remain, respond with the next question
            if session.current_question_index <= len(questions):
                next_question = questions[session.current_question_index - 1]

                # Save the chatbot's question as a message
                chatbot_message = ChatMessage.objects.create(
                    session=session,
                    message=next_question,
                    sender='chatbot'
                )

                return Response({
                    'messages': ChatMessageSerializer(session.messages.all(), many=True).data,
                    'error': None
                }, status=status.HTTP_200_OK)

        # Step 2: If all questions are answered, process and send to OpenAI
        if session.current_question_index >= len(questions):
            full_prompt = session.base_prompt + [
                {"role": "user", "content": f"{q['question']}: {q['answer']}"}
                for q in session.answered_questions
            ]

            chatbot_response = generate_chatbot_response(message, session.chat_type, full_prompt)

            if isinstance(chatbot_response, dict):
                text_response = chatbot_response.get('text_response', '')
                files = chatbot_response.get('files', [])
                chatbot_message = ChatMessage.objects.create(
                    session=session,
                    message=text_response,
                    sender='chatbot'
                )
                import base64
                for file_info in files:
                    file_url = file_info['file_url']
                    file_type = file_info.get('file_type', 'image/jpeg')
                    # file_type = file_info.get('file_type', 'application/octet-stream')
                    file_attachment = FileAttachment.objects.create(
                        session=session,
                        file=base64.b64encode(get_file_binary(file_url)).decode('utf-8'),
                        file_type=file_type
                    )
                    chatbot_message.file_attachments.add(file_attachment)
                    print(file_attachment.file)

                return Response({
                    'messages': ChatMessageSerializer(session.messages.all(), many=True).data,
                    'error': None
                }, status=status.HTTP_200_OK)

            else:
                ChatMessage.objects.create(
                    session=session,
                    message="Sorry, I couldn't generate a response at the moment. Please try again later.",
                    sender='chatbot'
                )
                return Response({
                    'messages': ChatMessageSerializer(session.messages.all(), many=True).data,
                    'error': None
                }, status=status.HTTP_200_OK)

        # Default fallback in case of an unexpected situation
        return Response({
            'messages': ChatMessageSerializer(session.messages.all(), many=True).data,
            'error': 'Unexpected error occurred.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def get_messages(self, request, pk=None):
        session = get_object_or_404(ChatSession, pk=pk, user=request.user)
        messages = session.messages.all()
        message_serializer = ChatMessageSerializer(messages, many=True)

        for message_data in message_serializer.data:
            if message_data.get('file_attachments'):
                for file_attachment in message_data['file_attachments']:
                    try:
                        file_obj = get_object_or_404(FileAttachment, id=file_attachment['id'])
                        file_path = file_obj.file.path

                        import base64
                        encoded_file = base64.b64encode(get_file_binary(file_path)).decode('utf-8')
                        file_attachment['file'] = encoded_file

                    except Exception as e:
                        file_attachment['file'] = None
                        print(f"Error reading file: {e}")
        return Response({
            'messages': message_serializer.data
        }, status=status.HTTP_200_OK)
