import React from 'react';
import { X, MessageSquare, User, Phone, MapPin, Globe } from 'lucide-react';

const MessageModal = ({ isOpen, onClose, inquiry }) => {
  if (!isOpen || !inquiry) return null;



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Student Inquiry Message</h2>
              <p className="text-sm text-gray-500">From {inquiry.fullName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Student Information */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{inquiry.fullName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 text-gray-400">📧</div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{inquiry.email}</p>
                </div>
              </div>
              {inquiry.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{inquiry.phone}</p>
                  </div>
                </div>
              )}
              {inquiry.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{inquiry.address}</p>
                  </div>
                </div>
              )}
              {(inquiry.country || inquiry.state) && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {inquiry.state && inquiry.country 
                        ? `${inquiry.state}, ${inquiry.country}`
                        : inquiry.state || inquiry.country
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Information */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Course Information</h3>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">📚</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course Interested In</p>
                <p className="font-medium text-gray-900">{inquiry.courseInterested}</p>
              </div>
            </div>
          </div>

          {/* Agent Information */}
          {inquiry.agentReferralKey && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Agent Information</h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">👤</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referral Key</p>
                  <p className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {inquiry.agentReferralKey}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages List */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Message History</h3>
            {inquiry.messages && inquiry.messages.length > 0 ? (
              <div className="space-y-4">
                {inquiry.messages.slice().reverse().map((msg, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${
                    msg.type === 'admin_reply' 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.type === 'admin_reply' 
                          ? 'bg-blue-100' 
                          : 'bg-primary-100'
                      }`}>
                        {msg.type === 'admin_reply' ? (
                          <div className="w-4 h-4 text-blue-600">📧</div>
                        ) : (
                          <MessageSquare className="w-4 h-4 text-primary-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${
                            msg.type === 'admin_reply' ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {msg.type === 'admin_reply' ? 'Admin Reply' : msg.courseInterested}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.submittedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className={`whitespace-pre-wrap leading-relaxed ${
                          msg.type === 'admin_reply' ? 'text-blue-800' : 'text-gray-700'
                        }`}>
                          {msg.message}
                        </p>
                        {msg.agentReferralKey && !msg.type === 'admin_reply' && (
                          <div className="mt-2 text-xs text-blue-600">
                            Agent Referral: {msg.agentReferralKey}
                          </div>
                        )}
                        {msg.type === 'admin_reply' && (
                          <div className="mt-2 text-xs text-blue-600">
                            Sent by: {msg.adminEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-gray-500 italic">No messages available</p>
                </div>
              </div>
            )}
          </div>



          {/* Inquiry Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Inquiry Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-900 capitalize">{inquiry.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted On</p>
                <p className="font-medium text-gray-900">
                  {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal; 